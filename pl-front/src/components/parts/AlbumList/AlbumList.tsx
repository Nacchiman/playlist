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
import { Album } from "../../../generated/model/album";

import {
  useCreateAlbum,
  useDeleteAlbum,
  useListAlbums,
  useUpdateAlbum,
} from "../../../generated/default/default";
import { Song } from "../../../generated/model";
import AlbumEditForm from "../AlbumEditForm/AlbumEditForm";
import AlbumSongList from "../AlbumSongList/AlbumSongList";
import useSongListInfoStore from "../SongList/useSongListStore";
import styles from "./AlbumList.module.css";
import useAlbumListInfoStore from "./useAlbumListStore";

const AlbumList = () => {
  const albumCreate = useCreateAlbum();
  const albumUpdate = useUpdateAlbum();
  const albumDelete = useDeleteAlbum();
  const albumsQuery = useListAlbums();
  const { albumList, setAlbumList } = useAlbumListInfoStore();
  const { songList } = useSongListInfoStore();
  const [openAlbumSongModalId, setOpenAlbumSongModalId] = useState<string>();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album>();

  useEffect(() => {
    if (!albumsQuery.isLoading) {
      setAlbumList(albumsQuery.data?.data ?? []);
    }
  }, [setAlbumList, albumsQuery.data?.data, albumsQuery.isLoading]);

  const columns: TableProps["columns"] = [
    {
      title: "アルバム名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "概要",
      dataIndex: "description",
      key: "description",
    },
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
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => {
              setEditingAlbum((state) => Object.assign(state ?? {}, record));
              setIsEditModalOpen(true);
            }}
          >
            編集
          </Button>
          <>
            <Popconfirm
              key={record.id}
              title="アルバム削除"
              description="削除しますか？"
              onConfirm={() => {
                if (record.id) {
                  albumDelete.mutateAsync({ id: record.id });
                  setAlbumList(albumList.filter((a) => a.id !== record.id));
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

  if (albumsQuery.error) {
    return (
      <>
        Failed to get Albums info.
        <pre>{albumsQuery.error?.message || "Unknow reason."}</pre>
      </>
    );
  }

  return (
    <>
      <Row justify="end">
        <Col>
          <Button
            onClick={() => {
              const newAlbum: Album = {
                id: uuidv4(),
                name: "",
                description: "",
              };
              setEditingAlbum(newAlbum);
              setIsRegisterModalOpen(true);
            }}
            type="primary"
            className={styles.registerButton}
          >
            新規アルバム登録
          </Button>
        </Col>
      </Row>
      <Row>
        <Table
          className={styles.table}
          loading={albumsQuery.isLoading}
          rowKey={"id"}
          columns={columns}
          dataSource={albumList}
          pagination={{ position: ["bottomCenter"] }}
        />
        <Modal
          className={styles.modal}
          title="アルバム登録"
          open={isRegisterModalOpen}
          onCancel={() => {
            setEditingAlbum(undefined);
            setIsRegisterModalOpen(false);
          }}
          // デフォルトのOKボタンを消すために空配列を設定している
          footer={[]}
          width="70%"
          destroyOnClose
        >
          <AlbumEditForm
            isRegister={true}
            album={editingAlbum!}
            onOkCallback={(album) => {
              albumCreate.mutateAsync({ data: album });
              setAlbumList(albumList.concat(album));
              setEditingAlbum(undefined);
              setIsRegisterModalOpen(false);
            }}
            songs={songList}
          />
        </Modal>
        <Modal
          title="楽曲編集"
          open={isEditModalOpen}
          onCancel={() => {
            setEditingAlbum(undefined);
            setIsEditModalOpen(false);
          }}
          // デフォルトのOKボタンを消すために空配列を設定している
          footer={[]}
          width="70%"
          destroyOnClose
        >
          <AlbumEditForm
            album={editingAlbum!}
            onOkCallback={(album) => {
              albumUpdate.mutateAsync({ id: album.id ?? "", data: album });
              setAlbumList(
                albumList.map((original) =>
                  original.id === album.id ? album : original
                )
              );
              setEditingAlbum(undefined);
              setIsEditModalOpen(false);
            }}
            songs={songList}
          />
        </Modal>
      </Row>
    </>
  );
};

export default AlbumList;
