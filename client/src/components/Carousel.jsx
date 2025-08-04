import { useEffect, useRef, useState } from "react";
import ShowResult from "./search/ShowResult";

export default function Carousel({ title, list, type }) {
    const scrollRef = useRef(null);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

    const scroll = (direction) => {
        if (!scrollRef.current) return;
        const amount =  window.innerWidth * 0.5;
        scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    };

    const updateArrows = () => {
        const el = scrollRef.current;
        if (!el) return;
        const { scrollLeft, scrollWidth, clientWidth } = el;
        setAtStart(scrollLeft <= 0);
        setAtEnd(scrollLeft >= scrollWidth - clientWidth - 1); // fuzzy match
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        updateArrows();
        el.addEventListener('scroll', updateArrows);
        window.addEventListener('resize', updateArrows);

        return () => {
            el.removeEventListener('scroll', updateArrows);
            window.removeEventListener('resize', updateArrows);
        };
    }, []);

    useEffect(() => {
        updateArrows();
        const timeout = setTimeout(updateArrows, 2000)
        return () => clearTimeout(timeout);
    }, [list]);


    return (
        <div className={`shows-container text-light selectDisable position-relative carousel-wrapper
            ${atStart ? 'no-left' : ''}
            ${atEnd ? 'no-right' : ''}`}>
            <h1>{title}</h1>

            {!atStart && (
                <button className="carousel-arrow left" onClick={() => scroll('left')}>
                    〈
                </button>
            )}
            {!atEnd && (
                <button className="carousel-arrow right" onClick={() => scroll('right')}>
                    〉
                </button>
            )}

            <div className="carousel-scroll d-flex gap-4 justify-content-between" ref={scrollRef}>
                {list.map((listing, index) => (
                    <div className="show-wrapper d-flex flex-column" key={`${type}-${listing.show?.id || listing.id}`}>
                        <ShowResult show={listing.show || listing} index={index} hq={true} />
                        <h2>{index + 1}</h2>
                    </div>
                ))}
            </div>
        </div>
    )
}