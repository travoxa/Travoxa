import Link from "next/link"
function Cta() {
    return (
        <>
            <section className="relative py-32 px-6">

                {/* Background Image */}
                {/* <div className="absolute inset-0">
                <div className="absolute inset-0 bg-black/50"></div>
            </div> */}

                {/* Content */}
                <div className="relative max-w-4xl mx-auto text-center space-y-8 text-white">

                    <h2 className="Mont text-4xl md:text-6xl text-black font-bold leading-tight">
                        FIND YOUR NEXT <span className="italic">ADVENTURE</span>
                    </h2>

                    <p className="Inter text-lg md:text-xl text-black max-w-2xl mx-auto">
                        From hidden beaches to vibrant cities. Your perfect journey starts here.
                    </p>
                    <Link href="/tour">
                        <button className="Inter bg-white hover:bg-black hover:text-white px-10 py-4 rounded-full text-black border-2 border-black text-lg font-medium transition duration-300 shadow-lg ">
                            Explore Destinations →
                        </button>
                    </Link>

                </div>

            </section>
        </>
    )
}

export default Cta