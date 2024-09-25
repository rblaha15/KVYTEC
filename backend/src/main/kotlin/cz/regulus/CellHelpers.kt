package cz.regulus

import org.apache.poi.ss.usermodel.Cell
import org.apache.poi.ss.usermodel.CellType
import org.apache.poi.ss.usermodel.RichTextString
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.*

var Cell.value: Any?
    get() = when (cellType!!) {
        CellType._NONE -> ""
        CellType.NUMERIC -> numericCellValue
        CellType.STRING -> stringCellValue
        CellType.FORMULA -> "=$cellFormula"
        CellType.BLANK -> ""
        CellType.BOOLEAN -> booleanCellValue
        CellType.ERROR -> errorCellValue
    }
    set(value) = when (value) {
        is Double -> setCellValue(value)
        is Date -> setCellValue(value)
        is LocalDateTime -> setCellValue(value)
        is LocalDate -> setCellValue(value)
        is Calendar -> setCellValue(value)
        is RichTextString -> setCellValue(value)
        is String -> setCellValue(value)
        is Boolean -> setCellValue(value)
        else -> Unit
    }

val Cell.cachedValue: Any
    get() = requireNotNull(cachedValueOrNull) { "Only formula cells have cached results" }

val Cell.cachedValueOrNull: Any?
    get() = if (cellType != CellType.FORMULA) null
    else when (cachedFormulaResultType!!) {
        CellType.NUMERIC -> numericCellValue
        CellType.STRING -> stringCellValue
        CellType.BOOLEAN -> booleanCellValue
        CellType.ERROR -> errorCellValue
        else -> ""
    }

val Cell.cachedFormulaResultTypeOrNull
    get() = if (cellType != CellType.FORMULA) null else cachedFormulaResultType