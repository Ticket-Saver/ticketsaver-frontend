import IndiaYuridiaImg from '/events/IndiaYuridia.png'

export default function TicketsClaim() {
    return (
        <div className="w-full h-72 bg-neutral rounded-xl flex flex-row">
            <div className="flex flex-col justify-between p-4 py-6 w-2/5">
                <div className='text-3xl font-semibold'>
                    La India Yuridia
                </div>
                <div className="w-full h-[1px] bg-gradient-to-r from-[#E779C1] to-[#221551]"></div>
                <div className='text-xl pb-4'>
                    The Ritz Theatre, New Jersey
                </div>
                <div className='text-sm pb-10'>
                    You have a collectible ticket to claim! Connect your wallet now to secure it
                </div>
                <a>
                    <button className='btn btn-primary btn-outline px-10'>
                        Connect wallet
                    </button>
                </a>
            </div>
            <div className="w-3/5 flex justify-center items-center p-4">
                <img src={IndiaYuridiaImg} alt="Event Image" className="w-full h-full object-cover rounded-xl" />
            </div>
        </div>
    )
}