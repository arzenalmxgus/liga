interface EventImageProps {
  image: string;
  title: string;
  category: string;
}

const EventImage = ({ image, title, category }: EventImageProps) => {
  return (
    <div className="relative h-[400px] rounded-lg overflow-hidden">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/placeholder.svg';
        }}
      />
      <div className="absolute top-4 right-4 bg-accent/90 backdrop-blur-sm px-4 py-2 rounded-full">
        <span className="text-white font-semibold">{category}</span>
      </div>
    </div>
  );
};

export default EventImage;