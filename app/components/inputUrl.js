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

                {page !== "robots-txt-checker"
                    ? <RobotsDisclaimer
                        checked={scrapeEvenIfBlocked}
                        onChange={(value) => {
                            setScrapeEvenIfBlocked(value);
                            setHasCheckedPage(false); // reset until next fetch
                        }}
                    />
                    : null
                }

                <button
                    type="submit"
                    disabled={isCheckingPage || !inputUrl.trim() || !!error}
                >
                    {isCheckingPage ? "Fetching data..." : "Check Page"}
                </button>
            </fieldset>
        </form>
    )
}