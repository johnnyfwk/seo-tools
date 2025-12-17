export default function NavButton({ isNavVisible, setIsNavVisible }) {
    return (
        <div
            id="nav-button"
            onClick={() => {setIsNavVisible(!isNavVisible)}}
        >
            {isNavVisible
                ? <div></div>
                : <>
                    <div></div>
                    <div></div>
                    <div></div>
                </>
            }
        </div>
    )
}
