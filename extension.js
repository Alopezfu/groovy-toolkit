const vscode = require('vscode');
const { formatGroovyCode } = require('./formatter');

function activate(context) {
	console.log('Groovy Formatter enable');

	const disposable = vscode.languages.registerDocumentFormattingEditProvider('groovy', {
		provideDocumentFormattingEdits(document) {
			const text = document.getText();

			// Leer el valor configurado por el usuario
			const config = vscode.workspace.getConfiguration('groovyFormatter');
			const tabSize = config.get('tabSize', 2); // valor por defecto 2

			const formatted = formatGroovyCode(text, tabSize);

			const fullRange = new vscode.Range(
				document.positionAt(0),
				document.positionAt(text.length)
			);

			return [vscode.TextEdit.replace(fullRange, formatted)];
		}
	});

	context.subscriptions.push(disposable);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
};
