export default function NavButton({ isNavVisible, setIsNavVisible }) {
    return (
        <div
            id="nav-button"
            onClick={() => {setIsNavVisible(!isNavVisible)}}
        >
            {isNavVisible
                ? <div className="nav-close-button-line"></div>
                : <>
                    <div className="nav-open-button-line"></div>
                    <div className="nav-open-button-line"></div>
                    <div className="nav-open-button-line"></div>
                </>
            }
        </div>
    )
}
