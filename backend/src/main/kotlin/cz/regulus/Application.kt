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
import kotlin.math.roundToLong

fun main(args: Array<String>) = EngineMain.main(args)

enum class Type {
    String, Number
}

// Define allowed values
const val MAX_STRING_LENGTH = 30
const val MAX_DOUBLE_VALUE = 1_000_000.0

val zdroje = arrayOf("1", "2", "3")
val cirkulaceTV = arrayOf("ano", "ne")
val ohrevy = arrayOf("kombinovaně i kotlem", "bojlerem")
val jistice = arrayOf("3x16A", "3x20A", "3x25A")
val tc = arrayOf(
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

val resultLocations: Map<String, String> = mapOf(
    "nakladyVytapeniTVPred" to "H17",
    "nakladyVytapeniTVPo" to "L17",
    "nakladyOstatniPred" to "H26",
    "nakladyOstatniPo" to "L26",
)

fun sanitizeString(value: String): String {
    return value.take(MAX_STRING_LENGTH).replace(Regex("[^a-zA-Z0-9\\s]"), "")
}

fun sanitizeNumber(value: String): Double? {
    return value.toDoubleOrNull()?.takeIf { it <= MAX_DOUBLE_VALUE }
}

fun validateOption(value: String, options: Array<String>, name: String): Boolean {
    return if (value in options) {
        true
    } else {
        println("Invalid value for $name: $value")
        false
    }
}

@Suppress("unused")
fun Application.module() {
    routing {
        post("/compute") {
            call.response.header("Access-Control-Allow-Origin", "*")
            call.response.header("Vary", "Origin")

            try {
                javaClass.getResource("/bilance.xlsx")!!.openStream().use { input ->
                    val workbook = WorkbookFactory.create(input)
                    val evaluator = workbook.creationHelper.createFormulaEvaluator()

                    // Remove unnecessary sheets
                    (0 until workbook.numberOfSheets).filter { i ->
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

                    // Process incoming values
                    locations.forEach { (name, location, type) ->
                        // Check if the name exists in values
                        val rawValue = values[name]

                        // Check for missing or null values
                        if (rawValue == null) {
                            return@post call.respond<String>(
                                status = HttpStatusCode.BadRequest,
                                "\"$name is required but not provided\""
                            )
                        }

                        // Validate options for specific fields
                        if (name == "puvodniZdroj" && !validateOption(rawValue, zdroje, "puvodniZdroj")) {
                            return@post call.respond<String>(
                                status = HttpStatusCode.BadRequest,
                                "\"$name has an invalid value\""
                            )
                        }

                        if (name == "zpusobOhrevu" && !validateOption(rawValue, ohrevy, "zpusobOhrevu")) {
                            return@post call.respond<String>(
                                status = HttpStatusCode.BadRequest,
                                "\"$name has an invalid value\""
                            )
                        }

                        if (name == "jisticPred" && !validateOption(rawValue, jistice, "jisticPred")) {
                            return@post call.respond<String>(
                                status = HttpStatusCode.BadRequest,
                                "\"$name has an invalid value\""
                            )
                        }

                        if (name == "jisticPo" && !validateOption(rawValue, jistice, "jisticPo")) {
                            return@post call.respond<String>(
                                status = HttpStatusCode.BadRequest,
                                "\"$name has an invalid value\""
                            )
                        }

                        if (name == "cirkulaceTV" && !validateOption(rawValue, cirkulaceTV, "cirkulaceTV")) {
                            return@post call.respond<String>(
                                status = HttpStatusCode.BadRequest,
                                "\"$name has an invalid value\""
                            )
                        }

                        if (name == "tc" && !validateOption(rawValue, tc, "tc")) {
                            return@post call.respond<String>(
                                status = HttpStatusCode.BadRequest,
                                "\"$name has an invalid value\""
                            )
                        }

                        val sanitizedValue = when (type) {
                            Type.String -> sanitizeString(rawValue)
                            Type.Number -> sanitizeNumber(rawValue)?.toString() ?: return@post call.respond<String>(
                                status = HttpStatusCode.BadRequest,
                                "\"$name is not a valid number\""
                            )
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
            } catch (e: Exception) {
                // Log the error and respond with an Internal Server Error
                println("Error: ${e.message}")
                call.respond(HttpStatusCode.InternalServerError, "An error occurred.")
            }
        }
    }
}
