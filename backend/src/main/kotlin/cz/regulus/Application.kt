package cz.regulus

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.netty.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.utils.io.core.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import org.apache.poi.ss.usermodel.CellType
import org.apache.poi.ss.usermodel.WorkbookFactory
import org.apache.poi.ss.util.CellAddress
import java.io.InputStream
import kotlin.io.use
import kotlin.math.roundToLong

fun main(args: Array<String>) = EngineMain.main(args)

enum class Type {
    String, Number
}

// Define allowed values
const val MAX_STRING_LENGTH = 30
const val MAX_DOUBLE_VALUE = 1_000_000.0

val zdroje = listOf("1", "2", "3")
val cirkulaceTV = listOf("ano", "ne")
val ohrevy = listOf("kombinovaně i kotlem", "bojlerem")
val jistice = listOf("3x16A", "3x20A", "3x25A")
val tc = listOf(
    "RTC 6i", "RTC 13e", "RTC 20e",
    "EcoAir 614M", "EcoAir 622M", "EcoPart 612M",
    "EcoPart 616M", "EcoAir 406", "EcoAir 408",
    "EcoAir 410", "EcoAir 415", "EcoAir 420",
    "EcoPart 406", "EcoPart 408", "EcoPart 410",
    "EcoPart 412", "EcoPart 414", "EcoPart 417"
)

val locations: List<Triple<String, String, Type>> = listOf(
    Triple("puvodniZdroj", "B13", Type.Number),
    Triple("cenaZP", "H13", Type.Number),
    Triple("cenaUhli", "H13", Type.Number),
    Triple("spotrebaUhli", "H14", Type.Number),
    Triple("ucinnost", "H15", Type.Number),
    Triple("zpusobOhrevu", "H16", Type.String),
    Triple("osob", "B8", Type.Number),
    Triple("pozadovanaTeplota", "I7", Type.Number),
    Triple("cirkulaceTV", "I8", Type.String),
    Triple("jisticPred", "H20", Type.String),
    Triple("jisticPo", "L20", Type.String),
    Triple("cenaEeVtPred", "H21", Type.Number),
    Triple("cenaEeNtPred", "H22", Type.Number),
    Triple("cenaEeVtPo", "L21", Type.Number),
    Triple("cenaEeNtPo", "L22", Type.Number),
    Triple("tepelnaZtrata", "B2", Type.Number),
    Triple("spotreba", "B9", Type.Number),
    Triple("venkovniTeplota", "B3", Type.Number),
    Triple("teplotniSpad", "B4", Type.Number),
    Triple("tc", "B5", Type.String),
)

val validations: Map<String, List<String>> = mapOf(
    "puvodniZdroj" to zdroje,
    "zpusobOhrevu" to ohrevy,
    "jisticPred" to jistice,
    "jisticPo" to jistice,
    "cirkulaceTV" to cirkulaceTV,
    "tc" to tc,
)

val resultLocations: Map<String, String> = mapOf(
    "nakladyVytapeniTVPred" to "H17",
    "nakladyVytapeniTVPo" to "L17",
    "nakladyOstatniPred" to "H26",
    "nakladyOstatniPo" to "L26",
)

fun sanitizeString(value: String) =
    value.take(MAX_STRING_LENGTH).replace(Regex("[^a-zA-Z0-9\\s]"), "")

fun sanitizeNumber(value: String) =
    value.toDoubleOrNull()?.takeIf { it <= MAX_DOUBLE_VALUE }

fun validateOption(value: String, options: List<String>, name: String) =
    (value in options).also {
        if (!it) println("Invalid value for $name: $value")
    }

suspend fun RoutingContext.processExcelFile(input: InputStream) {
    val workbook = WorkbookFactory.create(input)
    val evaluator = workbook.creationHelper.createFormulaEvaluator()

    // Remove unnecessary sheets
    (0..<workbook.numberOfSheets).filter { i ->
        val sheet = workbook.getSheetAt(i)
        sheet.sheetName !in listOf(
            "Zadání+Výsledek",
            "Výpočet",
            "Polynomy",
        )
    }.sortedDescending().forEach(workbook::removeSheetAt)

    // Remove formulas in Polynomials sheet
    val polynomialsSheet = workbook.getSheet("Polynomy")
    polynomialsSheet.forEach { row ->
        row.forEach { cell ->
            if (cell.cellType == CellType.FORMULA) {
                cell.cellFormula = "\"\""
                cell.removeFormula()
            }
        }
    }

    val mainSheet = workbook.getSheet("Zadání+Výsledek")
    val values = Json.decodeFromString<Map<String, String?>>(call.receiveText())

    suspend fun respondBadRequest(message: String) = call.respond<String>(
        status = HttpStatusCode.BadRequest,
        message = message,
    )

    // Process incoming values
    locations.forEach { (name, location, type) ->

        val rawValue = values[name]
            ?: return respondBadRequest("\"$name is required but not provided\"")

        // Validate options for specific fields
        validations[name]?.let { list ->
            if (!validateOption(rawValue, list, name)) {
                return respondBadRequest("\"$name has an invalid value\"")
            }
        }

        val sanitizedValue = when (type) {
            Type.String -> sanitizeString(rawValue)
            Type.Number -> sanitizeNumber(rawValue)?.toString()
                ?: return respondBadRequest("\"$name is not a valid number\"")
        }

        // Update the Excel cell with the sanitized value
        val address = CellAddress(location)
        val cell = mainSheet.getRow(address.row).getCell(address.column)
        when (type) {
            Type.String -> cell.setCellValue(sanitizedValue)
            Type.Number -> cell.setCellValue(sanitizedValue.toDouble())
        }
        evaluator.notifyUpdateCell(cell)
    }

    evaluator.evaluateAll()

    // Collect results from the Excel sheet
    val result = resultLocations.mapValues { (_, location) ->
        val address = CellAddress(location)
        val cell = mainSheet.getRow(address.row).getCell(address.column)
        cell.numericCellValue.roundToLong()
    }

    workbook.close()

    call.respond(HttpStatusCode.OK, Json.encodeToString(result))
}

@Suppress("unused")
fun Application.module() {
    routing {
        post("/compute") {
            try {
                javaClass.getResource("/bilance.xlsx")!!.openStream().use {
                    processExcelFile(it)
                }
            } catch (e: Exception) {
                println("Error: ${e.message}")
                call.respond(HttpStatusCode.InternalServerError, "An error occurred.")
            }
        }
    }
}
