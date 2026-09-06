import "./ExcelTable.css";

const ExcelTable = ({ columns, rows, dimmed, showConfirmButton, confirmLabel = "הבנתי", onConfirm }) => (
  <div className={`excel-table-wrapper ${dimmed ? "is-dimmed" : ""}`}>
    <table className="excel-table">
      <thead>
        <tr>
          {columns.map((col) => <th key={col.key}>{col.label}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {columns.map((col) => <td key={col.key}>{row[col.key]}</td>)}
          </tr>
        ))}
        {Array.from({ length: Math.max(0, 8 - rows.length) }).map((_, i) => (
          <tr key={`empty-${i}`} className="excel-table__empty-row">
            {columns.map((col) => <td key={col.key}></td>)}
          </tr>
        ))}
      </tbody>
    </table>

    {showConfirmButton && (
      <div className="excel-cell-btn-wrapper">
        <button className="excel-cell-btn" onClick={onConfirm}>
          {confirmLabel}
          <span className="excel-cell-btn__handle" />
        </button>
      </div>
    )}
  </div>
);

export default ExcelTable;