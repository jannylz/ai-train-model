import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, Button, Form, Input, Table, Space, Popconfirm, message } from 'antd';
import * as http from '../../utils/http';

const TaskCreateForm = ({ visible, onCreate, onCancel, initData, projectId }) => {
  const [form] = Form.useForm();
  return (
    <Modal visible={visible} title="新建任务" okText="确定" cancelText="取消" onCancel={onCancel}
      onOk={() => {
        form.validateFields().then((values) => {
          values.project_id = projectId;
          if (initData.version_id) {//修改
            values.version_id = initData.version_id;
            http.post('/train/update_version', values).then((data) => {
              message.success('修改成功!');
              form.resetFields();
              onCreate();
            }).catch((err) => {
              console.log(err)
              message.error(err || '修改失败!');
            });

          } else {//新增
            http.post('/train/insert_version', values).then((data) => {
              message.success('新增成功!');
              form.resetFields();
              onCreate();
            }).catch((err) => {
              message.error(err || '新增失败!');
            });
          }
        }).catch((info) => {
          console.log('Validate Failed:', info);
        });
      }}
    >
      <Form form={form} name="form_in_modal" initialValues={initData}>
        <Form.Item name="version" label="版本" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="version_description" label="版本描述" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const Task = (props) => {
  let history = useHistory();
  const [visible, setVisible] = useState(false);
  const [columnsData, setColumnsData] = useState([]);
  const [projectId, setProjectId] = useState(null);
  const [projectPath, setProjectPath] = useState(null);
  const [status, setStatus] = useState(true);
  const [initFormData, setInitFormData] = useState({});

  const columns = [
    { title: '版本', dataIndex: 'version', key: 'version' },
    { title: '版本描述', dataIndex: 'version_description', key: 'version_description' },
    {
      title: '创建时间', dataIndex: 'version_create_time', key: 'version_create_time',
      render: (text) => {
        let reg = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
        return text.replace(reg, "$1-$2-$3 $4:$5:$6")
      }
    },
    {
      title: '操作', dataIndex: 'version_id', key: 'action',
      fixed: 'right',
      width: 150,
      render: (text, record) => (
        <Space size="middle">
          <a href="#" onClick={updateOneData.bind(this, record)}>修改 </a>
          <Popconfirm
            title="确定删除这个版本吗?"
            okText="确定"
            cancelText="取消"
            onConfirm={deletOneData.bind(this, record.version_id)}
          >
            <a href="#">删除</a>
          </Popconfirm>
          <a href="#" onClick={handleTrain.bind(this,record.version_id,record.version_path)}>配置</a>
        </Space>
      )
    },

  ];
  const handleTrain = (version_id,version_path) => {
    history.push("/configTrain",
      {
        project_id: projectId,
        project_path:projectPath,
        version_id,
        version_path
      });
  }

  useEffect(() => {
    const fetchTaskData = () => {
      const project_id = props.location.state ? props.location.state.project_id : null;
      if (project_id) {
        setProjectId(project_id);
        setProjectPath(props.location.state.project_path);
        http.post('/train/select_version', { project_id }).then(res => {
          //查询到版本
          setColumnsData(res.map((item, index) => { item.key = index; return item }))
        }).catch(e => {
          console.log(e);
        })
      } else {
        return;
      }
    }
    fetchTaskData();
  }, [props.location.state]);

  useEffect(() => {
    const fetchTaskData = async () => {
      if (projectId) {
        http.post('/train/select_version', { project_id: projectId }).then(res => {
          //查询到版本新需
          setColumnsData(res.map((item, index) => { item.key = index; return item }))
        }).catch(e => {
          console.log(e);
        })
      }
    }
    fetchTaskData();
  }, [status, projectId]);

  const onCreate = () => {
    setVisible(false);
    setStatus(!status);
    setInitFormData({});
  }

  const updateOneData = (record) => {
    setInitFormData(record);
    setVisible(true);
  }

  const deletOneData = async (version_id) => {
    http.post('/train/delete_version', { project_id: projectId, version_id }).then(() => {
      message.success('删除成功');
      setStatus(!status)
    }).catch(() => {
      message.error('删除失败');
    })
  }

  return (
    <div>
      <Button type="primary" onClick={() => { setVisible(true); setInitFormData({}) }}>+新建版本</Button>
      {visible && <TaskCreateForm visible={visible} onCreate={onCreate} onCancel={() => {
        setVisible(false);
        setInitFormData({});
      }} initData={initFormData} projectId={projectId}
      />}
      <Table bordered columns={columns} dataSource={columnsData} style={{ marginTop: 20 }} />
    </div>

  );
}

export default Task;
