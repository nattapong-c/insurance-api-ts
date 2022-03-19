import { Request, Response } from "express";
import { Quotation, QuotationCustomer, QuotationQuery } from "./quotation.model";
import { formatNumber2Decimal } from "../../utils/number";
import path from "path";
import fs from "fs";
import mustache from "mustache";
import pdf from "html-pdf";

const exportPDF = (res: Response, quotation: Quotation) => {
    var customers = [];
    for (let [index, c] of (quotation.customers as Array<QuotationCustomer>).entries()) {
        customers.push({
            ...c,
            company_name: `${index + 1}. ${c.company_name}`,
            amount: formatNumber2Decimal(c.amount ?? 0),
            act_amount: c.act_amount ? formatNumber2Decimal(c.act_amount) : "",
            end_date: new Intl.DateTimeFormat("th-TH").format(c.end_date)
        });
    }
    const data = {
        issue_date: new Intl.DateTimeFormat("th-TH", { dateStyle: "long" }).format(quotation.issue_date).split(" ")[1],
        customers,
        customer_info: {
            company_name: function () {
                return this.company_name;
            },
            plate_number: function () {
                return this.plate_number;
            },
            name: function () {
                return this.name;
            },
            insurance_amount: function () {
                return this.insurance_amount;
            },
            amount: function () {
                return this.amount;
            },
            act_amount: function () {
                return this.act_amount;
            },
            end_date: function () {
                return this.end_date;
            }
        }
    };

    let directory = path.join(__dirname, `../../../template/quotation.html`);
    let html = mustache.render(fs.readFileSync(directory, "utf8"), data);
    try {
        pdf.create(html, { format: "A4", orientation: "landscape" }).toBuffer(async (err, buffer) => {
            if (err || !Buffer.isBuffer(buffer)) {
                return res.status(400).send({ error: `create pdf error : ${err}` });
            }
            return res.send(buffer);
        });
    } catch (err) {
        return res.status(400).send({ error: `create pdf error : ${err}` });
    }
}

export const createQuotation = async (req: Request, res: Response) => {
    const quotation = await Quotation.create(req.body);
    return exportPDF(res, quotation);
}

export const getQuotations = async (req: Request, res: Response) => {
    const query = req.query as QuotationQuery;
    const response = await Quotation.getList(query);
    res.send(response);
}