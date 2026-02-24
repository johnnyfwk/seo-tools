import RobotsDisclaimer from "./robotsDisclaimer";

export default function InputUrl({
    inputUrl,
    setInputUrl,
    scrapeEvenIfBlocked,
    setScrapeEvenIfBlocked,
    handleCheckPage,
    isCheckingPage,
    setHasCheckedPage,
    error,
    setError,
    page = "",
}) {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleCheckPage();
            }}
            aria-busy={isCheckingPage}
        >
            <fieldset disabled={isCheckingPage}>
                <label htmlFor="url" className="sr-only">Enter URL:</label>

                {error
                    ? <p
                        id="url-error"
                        className="error-text"
                        role="alert"
                    >{error}</p>
                    : null
                }

                <div className="url-input-and-check-page-button-container">
                    <input
                        id="url"
                        type="url"
                        value={inputUrl}
                        onChange={(e) => {
                            setInputUrl(e.target.value);
                            if (error) setError(null);
                        }}
                        placeholder="Enter URL to check..."
                        aria-invalid={!!error}
                        aria-describedby={error ? "url-error" : undefined}
                    />
                    
                    <button
                        type="submit"
                        disabled={isCheckingPage || !inputUrl.trim() || !!error}
                    >
                        {isCheckingPage ? "Checking..." : "Check"}
                    </button>
                </div>
                

                {page !== "robots-txt-checker"
                    ? <RobotsDisclaimer
                        checked={scrapeEvenIfBlocked}
                        onChange={(value) => {
                            setScrapeEvenIfBlocked(value);
                            setHasCheckedPage(false);
                        }}
                    />
                    : null
                }
            </fieldset>
        </form>
    )
}