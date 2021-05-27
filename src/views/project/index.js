import { useState, useEffect } from 'react';
import * as http from '../../utils/http';
import { Modal, Button, Form, Input, Table, Space, Popconfirm, message, TreeSelect } from 'antd';
import { useHistory } from 'react-router-dom';

const TaskCreateForm = ({ visible, onCreate, onCancel, initData }) => {
  const [form] = Form.useForm();
  const [rootDataPath] = useState("D:\\work\\08_2021\\AI_Demos\\MiniCls");
  const [folder, setFolder] = useState([]);
  useEffect(() => {
    const fetchFolderData = async () => {
      let data = { "file_path": rootDataPath };
      const result = await http.post('/train/get_file_list', data);
      setFolder(result.folders.map((item) => genTreeNode(rootDataPath, item)));
    }
    fetchFolderData();
  }, [rootDataPath]);

  const onLoadFolder = (treeNode) =>
    new Promise(resolve => {
      const { id } = treeNode;
      if (folder.filter((item) => item.pId === id).length > 0) return resolve();
      setTimeout(async () => {
        const result = await http.post('/train/get_file_list', { "file_path": id });
        setFolder(folder.concat(
          result.folders.map(item => genTreeNode(id, item))
        ));
        resolve();
      }, 300);
    });

  const genTreeNode = (parentId, value, isLeaf = false) => {
    return {
      id: parentId + "/" + value,
      pId: parentId,
      value: parentId + "/" + value,
      title: value,
      isLeaf: isLeaf ? true : false,
    };
  };

  // const onFileChange = (value) => {
  //   setValue(value);
  // };

  return (
    <Modal visible={visible} title="新建项目" okText="确定" cancelText="取消" onCancel={onCancel}
      onOk={() => {
        form.validateFields().then((values) => {
          if (initData.project_id) {//修改
            values.project_id = initData.project_id;
            http.post('/train/update_project', values).then((data) => {
              message.success('修改成功');
              form.resetFields();
              onCreate();
            }).catch((err) => {
              console.log(err)
              message.error('修改失败');
            });

          } else {//新增
            http.post('/train/insert_project', values).then(() => {
              message.success('创建成功');
              form.resetFields();
              onCreate();
            }).catch(() => {
              message.error('新增失败');
            });
          }
        }).catch((info) => {
          console.log('Validate Failed:', info);
        });
      }}
    >
      <Form form={form} name="form_in_modal" initialValues={initData}>
        <Form.Item name="project_name" label="项目名称" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="project_description" label="项目描述" rules={[{ required: true }]}>
          <Input type="text" />
        </Form.Item>
        <Form.Item name="project_path" label="工作路径">
          {/* <Input  disabled={initData.project_id?true:false}/> */}
          <TreeSelect
            treeDataSimpleMode
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Please select"
            treeData={folder}
            loadData={onLoadFolder}
            disabled={initData.project_id ? true : false}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const Project = () => {
  let history = useHistory();
  const [visible, setVisible] = useState(false);
  const [columnsData, setColumnsData] = useState([]);
  const [status, setStatus] = useState(true);
  const [initFormData, setInitFormData] = useState({});

  const columns = [
    { title: '项目名称', dataIndex: 'project_name', key: 'project_name' },
    { title: '项目描述', dataIndex: 'project_description', key: 'project_description' },
    {
      title: '创建时间', dataIndex: 'project_create_time', key: 'project_create_time',
      render: (text) => {
        let reg = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
        return text.replace(reg, "$1-$2-$3 $4:$5:$6")
      }
    },
    {
      title: '操作', dataIndex: 'project_id', key: 'action',
      fixed: 'right',
      width: 150,
      render: (text, record) => (

        <Space size="middle">
          <a href="#" onClick={updateOneData.bind(this, record)}>修改 </a>
          <Popconfirm
            title="确定删除这个项目吗?"
            okText="确定"
            cancelText="取消"
            onConfirm={deletOneData.bind(this, record.project_id)}
          >
            <a href="#">删除</a>
          </Popconfirm>
          <a href="#" onClick={handTask.bind(this, record.project_id,record.project_path)}>查看 </a>
        </Space>
      )
    },
  ];

  const handTask = (project_id,project_path) => {
    history.push('/mytask', { project_id,project_path})
  }

  useEffect(() => {
    const fetchProjectData = async () => {
      const result = await http.post('/train/select_project');
      setColumnsData(result.map((item, index) => { item.key = index; return item }))
    }
    fetchProjectData();
  }, [status]);

  const onCreate = () => {
    setVisible(false);
    setStatus(!status);
    setInitFormData({});
  }

  const updateOneData = (record) => {
    setInitFormData(record);
    setVisible(true);
  }
  const deletOneData = async (project_id) => {
    http.post('/train/delete_project', { project_id }).then(() => {
      message.success('删除成功');
      setStatus(!status)
    }).catch(() => {
      message.error('删除失败');
    })
  }


  return (
    <div>
      <Button type="primary" onClick={() => { setVisible(true); setInitFormData({}) }}>+新建项目</Button>
      {visible && <TaskCreateForm visible={visible} onCreate={onCreate} onCancel={() => {
        setVisible(false);
        setInitFormData({});
      }} initData={initFormData}
      />}
      <Table bordered columns={columns} dataSource={columnsData} style={{ marginTop: 20 }} />
    </div>
  );
}

export default Project;
