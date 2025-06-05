function normalizeWhitespace(text) {

    const lines = text.split('\n');

    return lines
        .map(line => line.trim())
        .filter((line, i, arr) => {
            // Eliminar líneas en blanco duplicadas
            return !(line === '' && arr[i - 1]?.trim() === '');
        })
        .join('\n');
}

function cleanSpacing(text) {

    const lines = text.split('\n');

    return lines.map(line => {
        let cleaned = line.trim();

        const commentIndex = cleaned.indexOf('//');

        if (commentIndex !== -1) {
            const codePart = cleaned.slice(0, commentIndex);
            const commentPart = cleaned.slice(commentIndex);

            // Solo limpiar espacios en la parte de código
            let cleanedCode = codePart.replace(/\s{2,}/g, ' ');
            cleanedCode = cleanedCode.replace(/\s*{\s*$/, ' {');

            // Concatenar código limpio + comentario intacto
            return cleanedCode + commentPart;
        } else {
            let cleanedLine = cleaned.replace(/\s{2,}/g, ' ');
            cleanedLine = cleanedLine.replace(/\s*{\s*$/, ' {');
            return cleanedLine;
        }
    }).join('\n');
}

function indent(text, tabSize = 2) {

    const lines = text.split('\n');
    let indentLevel = 0;
    const indentSize = tabSize;

    return lines
        .map(line => {
            const trimmed = line.trim();

            if (trimmed.startsWith('}')) indentLevel = Math.max(indentLevel - 1, 0);

            const indent = ' '.repeat(indentLevel * indentSize);
            const formattedLine = indent + trimmed;

            if (trimmed.endsWith('{')) indentLevel++;

            return formattedLine;
        })
        .join('\n');
}

function addSpacesAroundOperators(text) {
    const doubleOps = ['>=', '<=', '==', '!=', '===', '!=='];
    return text.split('\n').map(line => {
        // Si no hay comillas, aplica normalmente
        if (!/["']/.test(line)) {
            let t = line;
            doubleOps.forEach(op => {
                const placeholder = op.replace(/./g, '_');
                t = t.replaceAll(op, placeholder);
            });
            t = t.replace(/([+\-*/=<>])(?=[^\s])/g, '$1 ');
            t = t.replace(/(?<=[^\s])([+\-*/=<>])/g, ' $1');
            doubleOps.forEach(op => {
                const placeholder = op.replace(/./g, '_');
                t = t.replaceAll(placeholder, op);
            });
            return t;
        }

        // Si hay comillas, solo aplica fuera de ellas
        let result = '';
        let inSingle = false;
        let inDouble = false;
        let buffer = '';
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === "'" && !inDouble) {
                inSingle = !inSingle;
                buffer += char;
            } else if (char === '"' && !inSingle) {
                inDouble = !inDouble;
                buffer += char;
            } else if (!inSingle && !inDouble) {
                buffer += char;
            } else {
                buffer += char;
            }
        }

        // Ahora, aplica la lógica solo fuera de comillas
        // Usamos una expresión regular para dividir por comillas
        const parts = line.split(/(".*?"|'.*?')/g);
        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
                // Fuera de comillas
                let t = parts[i];
                doubleOps.forEach(op => {
                    const placeholder = op.replace(/./g, '_');
                    t = t.replaceAll(op, placeholder);
                });
                t = t.replace(/([+\-*/=<>])(?=[^\s])/g, '$1 ');
                t = t.replace(/(?<=[^\s])([+\-*/=<>])/g, ' $1');
                doubleOps.forEach(op => {
                    const placeholder = op.replace(/./g, '_');
                    t = t.replaceAll(placeholder, op);
                });
                result += t;
            } else {
                // Dentro de comillas, no tocar
                result += parts[i];
            }
        }
        return result;
    }).join('\n');
}

function addBlankLineAfterOpeningBrace(text) {
    // Añade una línea en blanco después de cada '{' que abre un bloque,
    // excepto si ya hay una línea en blanco después o el bloque está vacío.
    return text.replace(
        /{\n([^\s\n}])/g,
        '{\n\n$1'
    );
}

function addSpaceAfterKeywords(text) {

    // Lista de palabras clave que suelen ir seguidas de un espacio antes del paréntesis o bloque
    const keywords = [
        // 'if', 'for', 'while', 'switch', 'catch', 'def', 'return', 'else', 'try', 'case'
        'if', 'for', 'while', 'switch', 'catch', 'else', 'try', 'case'
    ];

    // Construimos una expresión regular que detecte la palabra clave seguida directamente de algo que no sea espacio ni {
    // Ejemplo: if(condition) => queremos if (condition)
    // También para def foo() => def foo() (solo si def va seguido de algo sin espacio)
    const regex = new RegExp(`\\b(${keywords.join('|')})(?!\\s|\\{)`, 'g');

    return text.replace(regex, (match) => match + ' ');
}

function moveBraceToSameLine(text) {

    // Esto reemplaza un salto de línea seguido de solo { con un espacio y {
    // Para evitar afectar bloques donde { está bien separado, el patrón busca líneas terminadas en algo no { ni espacio
    // seguido de salto línea y luego una línea que solo tenga {

    return text.replace(/([^\s{])\s*\n\s*{/g, '$1 {');
}

function addBlankLinesBetweenBlocks(text) {

    // Añade una línea en blanco antes de métodos o declaraciones de clase, si no hay ya
    // Aquí buscamos líneas que terminan con `}` seguidas directamente de otra línea de código

    return text.replace(/}\n(?!\n)([^\s}])/g, '}\n\n$1');
}

function removeExtraBlankLines(text) {

    // Reemplaza 2 o más líneas vacías seguidas por solo una
    return text.replace(/\n{3,}/g, '\n\n');
}

function formatCollections(text) {

    // Añade espacio después de coma si no hay
    return text.replace(/,\s*/g, ', ');
}

function formatComments(text) {

    // Normaliza cualquier cantidad de espacios entre los dos slash
    text = text.replace(/\/\s+\/\s*/g, '// ');
    // Añade espacio después de // si no lo hay
    text = text.replace(/\/\/(?!\s)/g, '// ');
    // Normaliza cualquier cantidad de espacios entre / y * al inicio de comentario de bloque
    text = text.replace(/\/\s+\*/g, '/*');
    // Añade espacio después de /* si no lo hay
    text = text.replace(/\/\*(?!\s)/g, '/* ');
    // Normaliza cualquier cantidad de espacios entre * y / al final de comentario de bloque
    text = text.replace(/\*\s+\//g, '*/');
    return text;
}

module.exports = {
    normalizeWhitespace,
    cleanSpacing,
    indent,
    addSpacesAroundOperators,
    addSpaceAfterKeywords,
    moveBraceToSameLine,
    addBlankLinesBetweenBlocks,
    removeExtraBlankLines,
    formatCollections,
    formatComments
};