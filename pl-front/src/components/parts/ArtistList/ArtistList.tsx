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
import {
  useCreateArtist,
  useDeleteArtist,
  useListArtists,
  useUpdateArtist,
} from "../../../generated/artists/artists";
import { Artist } from "../../../generated/model/artist";
import ArtistEditForm from "../ArtistEditForm/ArtistEditForm";
import styles from "./ArtistList.module.css";
import useArtistListInfoStore from "./useArtistListStore";

const ArtistList = () => {
  const artistCreate = useCreateArtist();
  const artistUpdate = useUpdateArtist();
  const artistDelete = useDeleteArtist();
  const artistsQuery = useListArtists();
  const { artistList, setArtistList } = useArtistListInfoStore();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist>();

  useEffect(() => {
    if (!artistsQuery.isLoading) {
      setArtistList(artistsQuery.data?.data ?? []);
    }
  }, [artistsQuery.isLoading, artistsQuery.data?.data, setArtistList]);

  const columns: TableProps["columns"] = [
    {
      title: "名前",
      dataIndex: "name",
      key: "name",
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
              setEditingArtist((state) => Object.assign(state ?? {}, record));
              setIsEditModalOpen(true);
            }}
          >
            編集
          </Button>
          <>
            <Popconfirm
              key={record.id}
              title="アーティスト削除"
              description="削除しますか？"
              onConfirm={() => {
                if (record.id) {
                  artistDelete.mutateAsync({ id: record.id });
                  setArtistList(artistList.filter((a) => a.id !== record.id));
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

  if (artistsQuery.error) {
    return (
      <>
        Failed to get Artists info.
        <pre>{artistsQuery.error?.message || "Unknow reason."}</pre>
      </>
    );
  }

  return (
    <>
      <Row justify="end">
        <Col>
          <Button
            onClick={() => {
              const newArtist: Artist = {
                id: uuidv4(),
                name: "",
                description: "",
              };
              setEditingArtist(newArtist);
              setIsRegisterModalOpen(true);
            }}
            type="primary"
            className={styles.registerButton}
          >
            新規アーティスト登録
          </Button>
        </Col>
      </Row>
      <Row>
        <Table
          className={styles.table}
          loading={artistsQuery.isLoading}
          rowKey={"id"}
          columns={columns}
          dataSource={artistList}
          pagination={{ position: ["bottomCenter"] }}
        />
        <Modal
          title="アーティスト登録"
          open={isRegisterModalOpen}
          onCancel={() => {
            setEditingArtist(undefined);
            setIsRegisterModalOpen(false);
          }}
          // デフォルトのOKボタンを消すために空配列を設定している
          footer={[]}
        >
          <ArtistEditForm
            isRegister={true}
            artist={editingArtist!}
            onOkCallback={(artist) => {
              artistCreate.mutateAsync({ data: artist });
              setArtistList(artistList.concat(artist));
              setEditingArtist(undefined);
              setIsRegisterModalOpen(false);
            }}
          />
        </Modal>
        <Modal
          title="アーティスト編集"
          open={isEditModalOpen}
          onCancel={() => {
            setEditingArtist(undefined);
            setIsEditModalOpen(false);
          }}
          // デフォルトのOKボタンを消すために空配列を設定している
          footer={[]}
        >
          <ArtistEditForm
            artist={editingArtist!}
            onOkCallback={(artist) => {
              artistUpdate.mutateAsync({ id: artist.id ?? "", data: artist });
              setArtistList(
                artistList.map((original) =>
                  original.id === artist.id ? artist : original
                )
              );
              setEditingArtist(undefined);
              setIsEditModalOpen(false);
            }}
          />
        </Modal>
      </Row>
    </>
  );
};

export default ArtistList;
