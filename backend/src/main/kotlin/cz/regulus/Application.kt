package cz.regulus

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.netty.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import org.apache.poi.ss.usermodel.CellType
import org.apache.poi.ss.usermodel.WorkbookFactory
import org.apache.poi.ss.util.CellAddress
import java.io.InputStream
import kotlin.io.use
import kotlin.math.roundToLong

fun main(args: Array<String>) = EngineMain.main(args)

fun <T> T.toResult() =
    Type.SanitizationResult.Succeeded(this)

fun <T> T.toResult(reason: String, isValid: (T) -> Boolean) =
    if (isValid(this)) Type.SanitizationResult.Succeeded(this)
    else Type.SanitizationResult.Failed(reason)

fun <T> T?.toResult(reason: String): Type.SanitizationResult<out T> =
    if (this != null) Type.SanitizationResult.Succeeded(this)
    else Type.SanitizationResult.Failed(reason)

fun <T, U> Type.SanitizationResult<out T>.withValue(modify: T.() -> Type.SanitizationResult<out U>) =
    when (this) {
        is Type.SanitizationResult.Failed -> this
        is Type.SanitizationResult.Succeeded -> value.modify()
    }

sealed interface Type<T> {
    fun sanitize(input: String): SanitizationResult<out T>

    sealed interface SanitizationResult<T> {
        data class Failed(
            val reason: String,
        ) : SanitizationResult<Nothing>

        data class Succeeded<T>(
            val value: T,
        ) : SanitizationResult<T>
    }

    data object Number : Type<Double> {
        override fun sanitize(input: String) =
            input.toDoubleOrNull().toResult("Not a valid number").withValue {
                toResult("Number exceeds, maximum value") { it <= MAX_DOUBLE_VALUE }
            }
    }

    data object Text : Type<String> {
        override fun sanitize(input: String) =
            input.take(MAX_STRING_LENGTH).replace("[^\\p{L}\\p{N}\\s]".toRegex(), "").toResult()
    }

    data class ValueList<U : Type<V>, V>(
        val allowedValues: List<V>,
        val type: U,
    ) : Type<V> {
        override fun sanitize(input: String) = type.sanitize(input).withValue {
            toResult("Value not valid") { it in allowedValues }
        }
    }
}

// Define allowed values
const val MAX_STRING_LENGTH = 30
const val MAX_DOUBLE_VALUE = 1_000_000.0

val puvodniZdrojType = Type.ValueList(listOf(1.0, 2.0, 3.0), Type.Number)
val cirkulaceTVType = Type.ValueList(listOf("ano", "ne"), Type.Text)
val zpusobOhrevuType = Type.ValueList(listOf("kombinovaně i kotlem", "bojlerem"), Type.Text)
val jisticType = Type.ValueList(listOf("3x16A", "3x20A", "3x25A"), Type.Text)
val tcType = Type.ValueList(
    listOf(
        "RTC 6i", "RTC 13e", "RTC 20e",
        "EcoAir 614M", "EcoAir 622M", "EcoPart 612M",
        "EcoPart 616M", "EcoAir 406", "EcoAir 408",
        "EcoAir 410", "EcoAir 415", "EcoAir 420",
        "EcoPart 406", "EcoPart 408", "EcoPart 410",
        "EcoPart 412", "EcoPart 414", "EcoPart 417"
    ), Type.Text
)

data class Parameter(
    val location: String,
    val name: String,
    val type: Type<*>,
)

val parameters: List<Parameter> = listOf(
    Parameter("B13", "puvodniZdroj", puvodniZdrojType),
    Parameter("H13", "cenaZP", Type.Number),
    Parameter("H13", "cenaUhli", Type.Number),
    Parameter("H14", "spotrebaUhli", Type.Number),
    Parameter("H15", "ucinnost", Type.Number),
    Parameter("H16", "zpusobOhrevu", zpusobOhrevuType),
    Parameter("B8", "osob", Type.Number),
    Parameter("I7", "pozadovanaTeplota", Type.Number),
    Parameter("I8", "cirkulaceTV", cirkulaceTVType),
    Parameter("H20", "jisticPred", jisticType),
    Parameter("L20", "jisticPo", jisticType),
    Parameter("H21", "cenaEeVtPred", Type.Number),
    Parameter("H22", "cenaEeNtPred", Type.Number),
    Parameter("L21", "cenaEeVtPo", Type.Number),
    Parameter("L22", "cenaEeNtPo", Type.Number),
    Parameter("B2", "tepelnaZtrata", Type.Number),
    Parameter("B9", "spotreba", Type.Number),
    Parameter("B3", "venkovniTeplota", Type.Number),
    Parameter("B4", "teplotniSpad", Type.Number),
    Parameter("B5", "tc", tcType),
)

val resultLocations: Map<String, String> = mapOf(
    "nakladyVytapeniTVPred" to "H17",
    "nakladyVytapeniTVPo" to "L17",
    "nakladyOstatniPred" to "H26",
    "nakladyOstatniPo" to "L26",
)

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
    parameters.forEach { (location, name, type) ->

        val rawValue = values[name]
            ?: return respondBadRequest("$name: Required but not provided")

        val sanitizedValue = when (
            val result = type.sanitize(rawValue)
        ) {
            is Type.SanitizationResult.Failed -> return respondBadRequest(
                "$name: ${result.reason} ($rawValue)"
            )

            is Type.SanitizationResult.Succeeded -> result.value
        }

        // Update the Excel cell with the sanitized value
        val address = CellAddress(location)
        val cell = mainSheet.getRow(address.row).getCell(address.column)
        cell.value = sanitizedValue
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
