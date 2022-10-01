import * as vscode from "vscode";
import { child_process as childProcess } from "mz";
import { max, zip } from "./helper";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('"haskell-formatter" is now active');

	const formatter = vscode.languages.registerDocumentFormattingEditProvider(
		{
			scheme: "file",
			language: "haskell",
		},
		{
			async provideDocumentFormattingEdits(document: vscode.TextDocument): Promise<vscode.TextEdit[]> {
				//#region Check if hindent & stylish-haskell are installed
				try {
					await childProcess.exec("hindent --version");
				} catch (e: any) {
					return showErrorMessage("Cannot execute hindent", e);
				}
				try {
					await childProcess.exec("stylish-haskell --version");
				} catch (e: any) {
					return showErrorMessage("Cannot execute stylish-haskell", e);
				}
				//#endregion

				//#region Get document range
				const start = new vscode.Position(0, 0);
				const end = document.lineAt(document.lineCount - 1).range.end;
				const range = new vscode.Range(start, end);
				//#endregion

				let result = document.getText();
				//#region hindent
				try {
					result = childProcess.execSync("hindent", { input: result }).toString();
				} catch (e: any) {
					return showErrorMessage("Error while executing hindent", e);
				}
				//#endregion
				//#region stylish-haskell
				try {
					result = childProcess.execSync("stylish-haskell", { input: result }).toString();
				} catch (e: any) {
					return showErrorMessage("Error while executing stylish-haskell", e);
				}
				//#endregion

				result = alignEqualSigns(result);
				return [vscode.TextEdit.replace(range, result)];
			},
		}
	);

	const selectionFormatter = vscode.languages.registerDocumentRangeFormattingEditProvider(
		{
			scheme: "file",
			language: "haskell",
		},
		{
			async provideDocumentRangeFormattingEdits(document, range) {
				let result = document.getText(range);
				result = alignEqualSigns(result);
				return [vscode.TextEdit.replace(range, result)];
			},
		}
	);

	context.subscriptions.push(formatter, selectionFormatter);
}

function showErrorMessage(msg: string, err: Error): never[] {
	vscode.window.showErrorMessage(`${msg}: ${err.message}`);
	return [];
}

//FIXME Case `| abc == "x = y" = True`
function alignEqualSigns(text: string): string {
	const commentRegex = /\s*--.*/;
	const regexps = [
        /((?:((--|\s)*\|\s*)(.+))+)/g,
        /(--|\s)*where(?:\n[^\n]+.+=.+)+/g
    ];
	for (const regex of regexps) {
		for (const match of text.match(regex) ?? []) {
			const lines = match.split("\n");
			if (lines.length > 0 && lines[0] === "") {
				lines.shift();
			}
			const indices = lines.map((line) => (!commentRegex.test(line) ? line.indexOf(" = ") : -1));
			const maxIndex = max(indices) ?? -1;
			if (maxIndex === -1) {
				continue;
			}

			let newText = "";
			for (const [line, index] of zip(lines, indices)) {
				newText += "\n";
				if (index !== -1 && !commentRegex.test(line)) {
					newText += line.replace(" = ", addSpaces(" = ", maxIndex - index));
				} else {
					newText += line;
				}
			}
			text = text.replace(match, newText);
		}
	}
	return text;
}

function addSpaces(text: string, count: number): string {
	let result = "";
	for (let i = 0; i < count; i++) {
		result += " ";
	}
	return result + text;
}
