import { guideData as g, guideVideos } from '../data/guide';
import VideoTile from './VideoTile';

export default function AccessWalkthrough() {
  return (
    <VideoTile
      video={g.access.video}
      className="mx-auto w-full max-w-[340px]"
      label={guideVideos[g.access.video].title}
    />
  );
}
