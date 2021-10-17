import jsPDF from "jspdf";
import "jspdf-autotable";
import { offlineResults } from "../interfaces/app";

export const printReport = (
  sessionEarnings: number,
  results: Array<offlineResults>,
  finalBalance: number
) => {
  const doc = new jsPDF();

  const columns = ["Game No#", "Result", "Winning Hand", "Gainings"];
  //Text is slightly out of order to save resetting the fontface everyone time
  doc.text("$" + sessionEarnings, 62, 20);
  doc.text("$" + finalBalance, 52, 30);

  doc.text("Session Earnings:", 14, 20);
  doc.text("Final Balance:", 14, 30);

  results.forEach((result, i) => {
    const tableRows = result.winningHands.map((hands, i) => {
      const winner = hands.winner === "P" ? "Player" : "Dealer";
      return [i + 1, winner, hands.hand, hands.earnings];
    });
    //Get the end of the table, so the next table can be placed nicely
    const finalY: number = (doc as any).lastAutoTable.finalY || 40;
    doc.text(`Round #${i + 1}`, 14, finalY + 15);
    (doc as any).autoTable({
      head: [columns],
      body: tableRows,
      startY: finalY + 20,
    });
  });
  doc.save("results.pdf");
};
