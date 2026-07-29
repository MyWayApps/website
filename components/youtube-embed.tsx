interface YouTubeEmbedProps {
  videoId: string
  title: string
}

// Responsive 16:9 embed, privacy-enhanced mode (youtube-nocookie.com) since this is a kids' site.
export function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-xl" style={{ paddingTop: "56.25%" }}>
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  )
}
