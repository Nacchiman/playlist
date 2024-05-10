import { useListArtists } from "../../../generated/artists/artists";
import { useListAlbums } from "../../../generated/default/default";
import { useListSongs } from "../../../generated/songs/songs";
import SearchPage2 from "./SearchPage2";

// useQueryはQueryClientProviderの内部でのみ使えるため、
// SearchPageComponentとしてSearchPageから切り出している
const SearchPageComponent = () => {
  // TODO: クエリするデータ型のname, description以外のプロパティにも対応できるようにする
  const artistsQuery = useListArtists();
  const songsQuery = useListSongs();
  const albumsQuery = useListAlbums();

  return (
    <>
      <SearchPage2
        queries={[
          {
            queryResult: artistsQuery,
            label: "アーティスト",
            value: "artists",
          },
          {
            queryResult: songsQuery,
            label: "楽曲",
            value: "songs",
          },
          {
            queryResult: albumsQuery,
            label: "アルバム",
            value: "albums",
          },
        ]}
      />
    </>
  );
};

export default SearchPageComponent;
