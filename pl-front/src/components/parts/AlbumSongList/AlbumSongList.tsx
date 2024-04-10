import { Table, TableProps } from "antd";
import React, { useEffect, useState } from "react";
import { Song } from "../../../generated/model/song";
import styles from "./AlbumSongList.module.css";

export type AlbumSongListProps = {
  songList: Song[];
  selectedSongs?: Song[]; //楽曲選択をしたい時はselectedSongs状態変数とそのset関数を渡す
  setSelectedSongs?: (value: React.SetStateAction<Song[] | undefined>) => void;
};

const AlbumSongList = (props: AlbumSongListProps) => {
  const { songList, selectedSongs, setSelectedSongs } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const columns: TableProps<Song>["columns"] = [
    {
      title: "曲名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "アーティスト",
      dataIndex: "artist",
      key: "artist",
      render: (artist) => artist?.name,
    },
    {
      title: "概要",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
  ];

  useEffect(() => {
    const newSelectedRowKeys =
      selectedSongs?.map((song) => song.id as React.Key) ?? [];
    setSelectedRowKeys(newSelectedRowKeys);
  }, [selectedSongs]);

  const rowSelection = selectedSongs &&
    setSelectedSongs && {
      selectedRowKeys,
      onChange: (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(() => newSelectedRowKeys);
        // 曲一覧の中からチェックをつけた曲を抽出して状態変数に保持する
        const updatedSelectedSongs =
          songList?.filter((song) =>
            newSelectedRowKeys.includes(song.id as React.Key)
          ) ?? [];
        setSelectedSongs(updatedSelectedSongs);
      },
    };

  return (
    <Table
      className={styles.table}
      rowSelection={rowSelection}
      rowKey={"id"}
      columns={columns}
      dataSource={songList}
      pagination={{ pageSize: 5, position: ["bottomCenter"] }}
    />
  );
};

export default AlbumSongList;
