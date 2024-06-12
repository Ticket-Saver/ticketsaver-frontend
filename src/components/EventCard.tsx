export interface EventCardConfig {
  eventId: string;
  id: string;
  title: string;
  description: string;
  thumbnailURL: string;
  date:string;
  color?: string;
  fontColor?: string;
  venue?:string;
  city?:string;
}

export function EventCard({ title, city, date, description, thumbnailURL, color='bg-neutral', fontColor='text-neutral-content', venue}: EventCardConfig) {
  return (
    <div className={`card ${color} ${fontColor} shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer h-84 w-115`}>
      <figure>
        {
          thumbnailURL === 'none'?
          (
            <>
            <img
            src='ticketsaver.png'
            className="w-full object-cover h-50 object-top bg-white"
          />
        </>
          )
          :
          (
            <>
            <img
              src={thumbnailURL}
              alt="Event"
              className="w-full object-cover h-50 object-left-top aspect-video"
            />
            </>
          )
        }
      </figure>
      <div className="card-body px-4 py-6 pb-2 h-32">
        <div className="card-title">
          <h2 className="text-lg font-semibold mb-2">{title}</h2>
        </div>
        <h1 className="display inline-block">
          {city}
        </h1>
          <div className="justify-center display inline-block">
            <h2 className="badge badge-outline">
            {venue}
            </h2>
            <h2 className="badge badge-outline justify-end object-end">
            {date}
            </h2>
            </div>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
}
