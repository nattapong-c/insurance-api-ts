import { Request, Response } from "express";
import { Invoice, InvoiceQuery } from "./invoice.model";
import mustache from "mustache";
import pdf from "html-pdf";
import { convertToThaiDate } from "../../utils/date";
import { formatNumber2Decimal } from "../../utils/number";
import path from "path";
import fs from "fs";

export const getInvoices = async (req: Request, res: Response) => {
    const query = req.query as InvoiceQuery;
    const response = await Invoice.getList(query);
    res.send(response);
}

const exportPDF = (res: Response, invoice: Invoice) => {
    const invoiceData = {
        customer_name: invoice.customer_name,
        invoice_no: invoice.invoice_no,
        issue_date: convertToThaiDate(invoice.issue_date ?? new Date()),
        insurance_type: invoice.insurance_type,
        insurance_amount: invoice.insurance_amount,
        insurance_receiver: invoice.insurance_receiver,
        insurance_no: invoice.insurance_no,
        act_no: invoice.act_no ? invoice.act_no : "",
        plate_no: invoice.plate_no,
        amount: formatNumber2Decimal(invoice.amount ?? 0),
        amount_act: invoice.amount_act ? formatNumber2Decimal(invoice.amount_act) : "",
        amount_stamp: formatNumber2Decimal(invoice.amount_stamp ?? 0),
        total_amount_1: formatNumber2Decimal(invoice.total_amount_1 ?? 0),
        vat_7: formatNumber2Decimal(invoice.vat_7 ?? 0),
        total_amount_2: formatNumber2Decimal(invoice.total_amount_2 ?? 0),
        vat_at_paid: invoice.vat_at_paid ? formatNumber2Decimal(invoice.vat_at_paid) : "",
        total_amount_3: formatNumber2Decimal(invoice.total_amount_3 ?? 0),
        start_date: convertToThaiDate(invoice.start_date ?? new Date()),
        end_date: convertToThaiDate(invoice.end_date ?? new Date()),
        company_name: invoice.insurance_receiver,
        company_address: invoice.company_address,
        company_id: invoice.company_id
    };
    let directory = path.join(__dirname, `../../../template/invoice.html`);
    let html = mustache.render(fs.readFileSync(directory, "utf8"), invoiceData);
    try {
        pdf.create(html, { format: "A4" }).toBuffer(async (err, buffer) => {
            if (err || !Buffer.isBuffer(buffer)) {
                return res.status(400).send({ error: `create pdf error : ${err}` });
            }
            return res.send(buffer);
        });
    } catch (err) {
        return res.status(400).send({ error: `create pdf error : ${err}` });
    }
}

export const upsertInvoiceAndExport = async (req: Request, res: Response) => {
    const invoice = await Invoice.upsert(req.body);
    if (!invoice) return res.status(400).send({ error: "create invoice failed" });
    return exportPDF(res, invoice);
}

export const deleteInvoice = async (req: Request, res: Response) => {
    const id_list = req.query.id_list as string[];
    if (!id_list) return res.status(400).send("missing id_list");
    var idList: string[] = Array.isArray(id_list) ? id_list : [id_list];
    const response = await Invoice.delete(idList);
    res.send(response);
}

export const exportInvoice = async (req: Request, res: Response) => {
    const { invoiceNumber } = req.params;
    const invoice = await Invoice.get(invoiceNumber);
    return exportPDF(res, invoice);
}

export const getInvoiceOverview = async (req: Request, res: Response): Promise<any> => {
    const data = await Invoice.info();
    return res.send({
        message: "get info success",
        data
    });
}