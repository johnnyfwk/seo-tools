export default function StatusCode({ enteredUrlStatusCode }) {
    return (
        <section id="status-code">
            <h2>Status Code: <span className={enteredUrlStatusCode === 200 ? "success-text" : enteredUrlStatusCode >= 300 && enteredUrlStatusCode < 400 ? "warning-text" : "error-text"}>{enteredUrlStatusCode}</span></h2>
        </section>
    )
}