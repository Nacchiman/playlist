import {
  Button,
  Col,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  TableProps,
} from "antd";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Song } from "../../../generated/model/song";

import {
  useCreateSong,
  useDeleteSong,
  useListSongs,
  useUpdateSong,
} from "../../../generated/songs/songs";
import useArtistListInfoStore from "../ArtistList/useArtistListStore";
import SongEditForm from "../SongEditForm/SongEditForm";
import styles from "./SongList.module.css";
import useSongListInfoStore from "./useSongListStore";

const SongList = () => {
  const songCreate = useCreateSong();
  const songUpdate = useUpdateSong();
  const songDelete = useDeleteSong();
  const songsQuery = useListSongs();
  const { songList, setSongList } = useSongListInfoStore();
  const { artistList } = useArtistListInfoStore();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song>();

  useEffect(() => {
    if (!songsQuery.isLoading) {
      setSongList(songsQuery.data?.data ?? []);
    }
  }, [setSongList, songsQuery.data?.data, songsQuery.isLoading]);

  const columns: TableProps["columns"] = [
    {
      title: "曲名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "アーティスト",
      dataIndex: "artist",
      key: "artist",
      render: (artist) => artist.name,
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
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => {
              setEditingSong((state) => Object.assign(state ?? {}, record));
              setIsEditModalOpen(true);
            }}
          >
            編集
          </Button>
          <>
            <Popconfirm
              key={record.id}
              title="楽曲削除"
              description="削除しますか？"
              onConfirm={() => {
                if (record.id) {
                  songDelete.mutateAsync({ id: record.id });
                  setSongList(songList.filter((a) => a.id !== record.id));
                }
              }}
              okText="削除"
              cancelText="キャンセル"
              placement="left"
            >
              <Button danger>削除</Button>
            </Popconfirm>
          </>
        </Space>
      ),
    },
  ];

  if (songsQuery.error) {
    return (
      <>
        Failed to get Songs info.
        <pre>{songsQuery.error?.message || "Unknow reason."}</pre>
      </>
    );
  }

  return (
    <>
      <Row justify="end">
        <Col>
          <Button
            onClick={() => {
              const newSong: Song = {
                id: uuidv4(),
                name: "",
                description: "",
              };
              setEditingSong(newSong);
              setIsRegisterModalOpen(true);
            }}
            type="primary"
            className={styles.registerButton}
          >
            新規楽曲登録
          </Button>
        </Col>
      </Row>
      <Row>
        <Table
          className={styles.table}
          loading={songsQuery.isLoading}
          rowKey={"id"}
          columns={columns}
          dataSource={songList}
          pagination={{ position: ["bottomCenter"] }}
        />
        <Modal
          title="楽曲登録"
          open={isRegisterModalOpen}
          onCancel={() => {
            setEditingSong(undefined);
            setIsRegisterModalOpen(false);
          }}
          // デフォルトのOKボタンを消すために空配列を設定している
          footer={[]}
        >
          <SongEditForm
            isRegister={true}
            song={editingSong!}
            onOkCallback={(song) => {
              songCreate.mutateAsync({ data: song });
              setSongList(songList.concat(song));
              setEditingSong(undefined);
              setIsRegisterModalOpen(false);
            }}
            artists={artistList}
          />
        </Modal>
        <Modal
          title="楽曲編集"
          open={isEditModalOpen}
          onCancel={() => {
            setEditingSong(undefined);
            setIsEditModalOpen(false);
          }}
          // デフォルトのOKボタンを消すために空配列を設定している
          footer={[]}
        >
          <SongEditForm
            song={editingSong!}
            onOkCallback={(song) => {
              songUpdate.mutateAsync({ id: song.id ?? "", data: song });
              setSongList(
                songList.map((original) =>
                  original.id === song.id ? song : original
                )
              );
              setEditingSong(undefined);
              setIsEditModalOpen(false);
            }}
            artists={artistList}
          />
        </Modal>
      </Row>
    </>
  );
};

export default SongList;
