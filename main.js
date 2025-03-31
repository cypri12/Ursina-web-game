async function main() {
    let pyodide = await loadPyodide();
    console.log("Pyodide chargé !");
    await pyodide.loadPackage(["numpy", "micropip"]);
    await pyodide.runPythonAsync(await (await fetch("main.py")).text());
}

main();
