import {
  Button,
  Checkbox,
  Col,
  Input,
  Modal,
  Radio,
  RadioChangeEvent,
  Row,
  Table,
} from "antd";
import { useEffect, useState } from "react";

import { CheckboxValueType } from "antd/es/checkbox/Group";
import { useListArtists } from "../../../generated/artists/artists";
import { useListAlbums } from "../../../generated/default/default";
import { Album, Artist, Song } from "../../../generated/model";
import { useListSongs } from "../../../generated/songs/songs";
import useAlbumListInfoStore from "../../parts/AlbumList/useAlbumListStore";
import AlbumSongList from "../../parts/AlbumSongList/AlbumSongList";
import useArtistListInfoStore from "../../parts/ArtistList/useArtistListStore";
import useSongListInfoStore from "../../parts/SongList/useSongListStore";

const SearchPage = () => {
  const artistsQuery = useListArtists();
  const songsQuery = useListSongs();
  const albumsQuery = useListAlbums();
  const { artistList, setArtistList } = useArtistListInfoStore();
  const { songList, setSongList } = useSongListInfoStore();
  const { albumList, setAlbumList } = useAlbumListInfoStore();
  const [searchType, setSearchType] = useState("songs");
  const [openAlbumSongModalId, setOpenAlbumSongModalId] = useState<string>();
  const [searchText, setSearchText] = useState("");
  const [filterAttributes, setFilterAttributes] = useState([
    "name",
    "description",
  ]);

  useEffect(() => {
    setArtistList(artistsQuery.data?.data ?? []);
    setSongList(songsQuery.data?.data ?? []);
    setAlbumList(albumsQuery.data?.data ?? []);
  }, [
    albumsQuery.data?.data,
    artistsQuery.data?.data,
    setAlbumList,
    setArtistList,
    setSongList,
    songsQuery.data?.data,
  ]);

  let dataSource: Song[] | Artist[] | Album[] = [];
  if (searchType === "songs") {
    dataSource = songList;
  } else if (searchType === "artists") {
    dataSource = artistList;
  } else if (searchType === "albums") {
    dataSource = albumList;
  }

  const handleFilterChange = (checkedValues: CheckboxValueType[]) => {
    setFilterAttributes(checkedValues as string[]);
  };

  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  // OR検索を行い、選択された属性でフィルタリング
  const filterDataSource = () => {
    // 半角または全角スペースで検索テキストを分割
    const keywords = searchText.trim().split(/[\s　]+/);
    if (!searchText || filterAttributes.length === 0) {
      return dataSource;
    }

    return dataSource.filter((item) => {
      return filterAttributes.some((attr) => {
        const value = item[attr];
        if (!value) return false;
        const lowerValue = value.toLowerCase();
        return keywords.some((keyword) =>
          lowerValue.includes(keyword.toLowerCase())
        );
      });
    });
  };

  const filteredDataSource = filterDataSource();

  const handleSearchTypeChange = (e: RadioChangeEvent) => {
    setSearchType(e.target.value);
  };

  // 検索タイプに基づいて列を動的に定義
  const columns = [
    {
      title: "名前",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "説明",
      dataIndex: "description",
      key: "description",
    },
    // アルバム検索の場合のみ収録曲の列を表示
    ...(searchType === "albums"
      ? [
          {
            title: "収録曲",
            dataIndex: "songs",
            key: "songs",
            render: (songs: Song[], record: Album) => (
              <>
                <Button onClick={() => setOpenAlbumSongModalId(record.id)}>
                  曲一覧
                </Button>
                <Modal
                  open={openAlbumSongModalId === record.id}
                  onCancel={() => setOpenAlbumSongModalId(undefined)}
                  footer={[]}
                  destroyOnClose
                >
                  <AlbumSongList songList={songs} />
                </Modal>
              </>
            ),
          },
        ]
      : []),
  ];

  return (
    <div>
      <Row gutter={16}>
        <Col>
          <Radio.Group onChange={handleSearchTypeChange} value={searchType}>
            <Radio value="songs">楽曲</Radio>
            <Radio value="artists">アーティスト</Radio>
            <Radio value="albums">アルバム</Radio>
          </Radio.Group>
        </Col>
        <Col>
          <Input placeholder="検索..." onChange={handleSearchTextChange} />
        </Col>
        <Col>
          <Checkbox.Group
            options={[
              { label: "名前で検索", value: "name" },
              { label: "説明で検索", value: "description" },
            ]}
            defaultValue={["name", "description"]}
            onChange={handleFilterChange}
          />
        </Col>
      </Row>
      <Table
        dataSource={filteredDataSource}
        // dataSource={dataSource}
        columns={columns}
        rowKey="id"
        pagination={{ position: ["bottomCenter"] }}
      />
    </div>
  );
};

export default SearchPage;
