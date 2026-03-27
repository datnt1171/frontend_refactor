"use client";

import { useState, useCallback } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UploadCloud, FileText, Download, FlaskConical, AlertCircle, CheckCircle2 } from "lucide-react";

interface ColorantRow {
  name: string;
  percent: number;
  amount: number;
}

interface FormulaData {
  filename: string;
  date: string;
  target: string;
  formula: string;
  colorants: ColorantRow[];
}

function parseTxtFile(filename: string, content: string): FormulaData {
  const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);

  let date = "";
  let target = "";
  let formula = "";
  const colorants: ColorantRow[] = [];

  for (const line of lines) {
    if (/^F\d+\s+\d{2}\/\d{2}\/\d{4}/.test(line)) {
      const match = line.match(/(\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2})/);
      if (match) date = match[1]!;
      continue;
    }
    if (line.startsWith("TARGET")) {
      target = line.replace(/^TARGET\s*:\s*/i, "").trim();
      continue;
    }
    if (line.startsWith("Formula:")) {
      formula = line.replace(/^Formula:\s*/i, "").trim();
      continue;
    }
    if (/Colorant Name/i.test(line)) continue;
    if (line.startsWith("(")) continue;

    const tokens = line.split(/\s{2,}/);
    if (tokens.length >= 3) {
      const amount = parseFloat(tokens[tokens.length - 1]!);
      const percent = parseFloat(tokens[tokens.length - 2]!);
      const name = tokens.slice(0, tokens.length - 2).join(" ").trim();
      if (!isNaN(percent) && !isNaN(amount) && name) {
        colorants.push({ name, percent, amount });
      }
    }
  }

  return { filename, date, target, formula, colorants };
}

function buildWorkbook(formulas: FormulaData[]): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();

  for (const f of formulas) {
    const sheetName = f.filename.replace(/\.txt$/i, "").slice(0, 31);

    const rows: (string | number)[][] = [
      ["Date", f.date],
      ["Target", f.target],
      ["Formula", f.formula],
      [],
      ["Colorant Name", "Percent (%)", "Amount"],
    ];

    for (const c of f.colorants) {
      rows.push([c.name, c.percent, c.amount]);
    }

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = [{ wch: 40 }, { wch: 14 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  }

  return wb;
}

export default function FormulaConverterPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [parsed, setParsed] = useState<FormulaData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback((selected: FileList | null) => {
    if (!selected) return;
    const txtFiles = Array.from(selected).filter((f) =>
      f.name.toLowerCase().endsWith(".txt")
    );
    if (!txtFiles.length) {
      setError("Please upload .txt formula files.");
      return;
    }
    setError(null);
    setFiles(txtFiles);
    setParsed([]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleParse = useCallback(async () => {
    const results: FormulaData[] = [];
    for (const file of files) {
      const text = await file.text();
      results.push(parseTxtFile(file.name, text));
    }
    setParsed(results);
  }, [files]);

  const handleExport = useCallback(() => {
    if (!parsed.length) return;
    const wb = buildWorkbook(parsed);
    XLSX.writeFile(wb, "formulas.xlsx");
  }, [parsed]);

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <FlaskConical className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Formula Converter</h1>
          <p className="text-sm text-muted-foreground">Convert .txt formula files to Excel</p>
        </div>
      </div>

      <Separator />

      {/* Upload card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload Files</CardTitle>
          <CardDescription>Accepts multiple .txt formula files</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drop zone */}
          <label
            htmlFor="file-input"
            className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors
              ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/40"}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <UploadCloud className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">Drop files here or click to browse</p>
            <p className="text-xs text-muted-foreground">.txt files only</p>
            <input
              id="file-input"
              type="file"
              accept=".txt"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>

          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-1.5">
              {files.map((f) => (
                <div key={f.name} className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="truncate">{f.name}</span>
                  <Badge variant="secondary" className="ml-auto shrink-0">
                    {(f.size / 1024).toFixed(1)} KB
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleParse} disabled={!files.length} variant="default">
          Parse Files
        </Button>
        <Button onClick={handleExport} disabled={!parsed.length} variant="secondary">
          <Download className="h-4 w-4 mr-2" />
          Download Excel
        </Button>
      </div>

      {/* Preview cards */}
      {parsed.map((f) => (
        <Card key={f.filename}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  {f.filename}
                </CardTitle>
                <CardDescription className="text-xs">
                  {f.date} · {f.target}
                </CardDescription>
              </div>
              <Badge variant="outline">Formula {f.formula}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Colorant Name</TableHead>
                  <TableHead className="text-right">Percent (%)</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {f.colorants.map((c) => (
                  <TableRow key={c.name}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-right">{c.percent}</TableCell>
                    <TableCell className="text-right">{c.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}