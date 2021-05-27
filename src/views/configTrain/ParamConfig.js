import React, { useState } from 'react';
import { Collapse } from 'antd';

import { Form, Input, InputNumber, Button, Radio, Select, Switch, Checkbox, Row, Col, Space } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
const { Panel } = Collapse;

const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 18,
  },
};

const modelOptions = ["alexnet", "densenet121", "densenet169", "densenet201", "densenet161", "googlenet", "inception_v3", "mnasnet0_5", "mnasnet1_0", "mobilenet_v2", "mobilenet_v3_small", "mobilenet_v3_large", "resnet18", "resnet34", "resnet50", "resnet101", "resnet152", "resnext50_32x4d", "resnext101_32x8d", "wide_resnet50_2", "wide_resnet101_2", "shufflenetv2_x0.5", "shufflenetv2_x1.0", "squeezenet1_0", "squeezenet1_1", "vgg11", "vgg11_bn", "vgg13", "vgg13_bn", "vgg16", "vgg16_bn", "vgg19_bn", "vgg19"].map((item, index) => {
  return <Select.Option key={index.toString()}>{item} </Select.Option >;
})
const validateMessages = {
  required: '${label} is required!',
  types: {
    number: '${label} is not a valid number!',
  }
};

const ParamConfig = (props) => {
  const { dataVals, initVals, onCreate, OnCheckTrain } = props;
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();
  const [form4] = Form.useForm();
  const [fullyConnectedHead, setFullyConnectedHead] = useState(initVals.network.custom_head.length);
  const [degreesBox, setDegreesBox] = useState(true);
  const [translateBox, setTranslateBox] = useState(true);
  const [scaleBox, setScaleBox] = useState(true);
  const [shearBox, setShearBox] = useState(false);
  const [randomHorizontalFlip, setRandomHorizontalFlip] = useState(true);
  const [randomVerticalFlip, setRandomVerticalFlip] = useState(false);
  const [brightness, setBrightness] = useState(true);
  const [contrast, setContrast] = useState(false);
  const [saturation, setSaturation] = useState(false);
  const [hueBox, setHueBox] = useState(false);
  const [randomGrayscale, setRandomGrayscale] = useState(false);
  const [warmup, setWarmup] = useState(true);

  const changeFullyConnected = (status) => {
    setFullyConnectedHead(status)
  }

  const handSubmit = async () => {
    try {
      const data = await form1.validateFields();
      const transforms = await form2.validateFields();
      transforms.Resize = {
        "size": [data.input_height, data.input_width],
        "interpolation": "BILINEAR"
      }
      const network = await form3.validateFields();
      const training = await form4.validateFields();
      training.resume = true;
      if (!(training.lr_decay_milestones instanceof Array)) {
        training.lr_decay_milestones = training.lr_decay_milestones.split(",").map(Number);
      }
      onCreate(data, transforms, network, training)
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  const changeThisNull = (form, checked, val, initVal) => {
    console.log(dataVals)
    const params = form.getFieldsValue(true);
    if (val instanceof Array) {
      checked && (params[val[0]][val[1]] = initVal);
    } else {
      checked && (params[val] = initVal);
    }
  }

  return (
    <Collapse defaultActiveKey={['1']}>
      <Panel header="参数配置" key="1">
        <Form {...layout} form={form1} name="data" size={"small"}
          initialValues={dataVals.data}
          validateMessages={validateMessages}
        >
          <Form.Item label="图像输入的尺寸" className={'no_margin_bootom'} >
            <span>高:</span>
            <Form.Item name={'input_height'} style={{ display: 'inline-block' }} rules={[{ required: true }]}>
              <InputNumber min={1} />
            </Form.Item>
            <span>宽:</span>
            <Form.Item name={'input_width'} style={{ display: 'inline-block' }} rules={[{ required: true }]}>
              <InputNumber min={1} />
            </Form.Item>
          </Form.Item>
          <Form.Item name={'batch_size'} label="批大小(Batch Size)" rules={[{ required: true }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item name={'bgr2rgb'} label="输入图像通道顺序" rules={[{ required: true }]}>
            <Radio.Group >
              <Radio value={true}>RGB</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
            数据增强
        <Form {...layout} form={form2} name="transforms"
          size={"small"}
          initialValues={dataVals.data.transforms}
          validateMessages={validateMessages}
        >
          <FormItem>
            <Row justify="left">
              <Col span={4} style={{ textAlign: "right" }}>
                <Checkbox value={['RandomAffine', 'degrees']} defaultChecked={degreesBox} onChange={(e) => {
                  setDegreesBox(e.target.checked);
                  changeThisNull(form2, e.target.checked, e.target.value, initVals.data.transforms['RandomAffine']['degrees']);
                }}>
                  随机旋转
              </Checkbox>
              </Col>
              <Col span={4}>
                {degreesBox && <Form.Item className={'no_margin_bootom'} name={['RandomAffine', 'degrees']} label="旋转角">
                  <InputNumber min={1} />
                </Form.Item>
                }
              </Col>
              <Col span={4} style={{ textAlign: "right" }}>
                <Checkbox value="translate" defaultChecked={translateBox} onChange={(e) => {
                  setTranslateBox(e.target.checked);
                  changeThisNull(form2, e.target.checked, e.target.value, initVals.data.transforms['translate']);
                }}>
                  随机平移:
              </Checkbox>
              </Col>
              {translateBox && <Col>
                <span>水平平移比例:</span>
                <Form.Item className={'no_margin_bootom'} name={['RandomAffine', 'translate', 0]} style={{ display: 'inline-block' }}>
                  <InputNumber min={0} max={1} step={0.1} />
                </Form.Item>
                <span>竖直平移比例:</span>
                <Form.Item className={'no_margin_bootom'} name={['RandomAffine', 'translate', 1]} style={{ display: 'inline-block' }}>
                  <InputNumber min={0} max={1} step={0.1} />
                </Form.Item>
              </Col>
              }
            </Row>
          </FormItem>
          <FormItem>
            <Row justify="left">
              <Col span={4} style={{ textAlign: "right" }}>
                <Checkbox value="shear" defaultChecked={shearBox} onChange={(e) => {
                  setShearBox(e.target.checked)
                  changeThisNull(form2, e.target.checked, e.target.value, initVals.data.transforms['shear']);
                }}>
                  随机错切:
              </Checkbox>
              </Col>
              <Col span={4}>
                {shearBox && <Row wrap={false}>
                  <Form.Item className={'no_margin_bootom'} name={['RandomAffine', 'shear']} label="概率:">
                    <InputNumber min={0} step={0.1} value={shearBox} />
                  </Form.Item>
                </Row>
                }
              </Col>

              <Col span={4} style={{ textAlign: "right" }}>
                <Checkbox value="scale" defaultChecked={scaleBox} onChange={(e) => {
                  setScaleBox(e.target.checked)
                  changeThisNull(form2, e.target.checked, e.target.value, initVals.data.transforms['scale']);
                }} >
                  随机缩放:
               </Checkbox>
              </Col>
              {scaleBox && <Col>
                <Form.Item className={'no_margin_bootom'} name={['RandomAffine', 'scale', 0,]} style={{ display: 'inline-block' }}>
                  <InputNumber min={0} max={1} step={0.1} /></Form.Item>
                <span>~</span>
                <Form.Item className={'no_margin_bootom'} name={['RandomAffine', 'scale', 1,]} style={{ display: 'inline-block' }}>
                  <InputNumber min={0} step={0.1} /></Form.Item>
              </Col>
              }
            </Row>
          </FormItem>

          <FormItem>
            <Row justify="left">
              <Col span={4} style={{ textAlign: "right" }}>
                <Checkbox value="RandomHorizontalFlip" defaultChecked={randomHorizontalFlip} onChange={(e) => {
                  setRandomHorizontalFlip(e.target.checked);
                  changeThisNull(form2, e.target.checked, e.target.value, initVals.data.transforms['RandomHorizontalFlip']);
                }}>
                  随机水平翻转:
              </Checkbox>
              </Col>
              <Col span={4} >
                {randomHorizontalFlip &&
                  <Form.Item className={'no_margin_bootom'} name={['RandomHorizontalFlip', 'p']} label="概率:">
                    <InputNumber min={0} step={0.1} />
                  </Form.Item>
                }
              </Col>
              <Col span={4} style={{ textAlign: "right" }}>
                <Checkbox value="RandomVerticalFlip"
                  defaultChecked={randomVerticalFlip}
                  onChange={(e) => {
                    setRandomVerticalFlip(e.target.checked);
                    changeThisNull(form2, e.target.checked, e.target.value, initVals.data.transforms['RandomVerticalFlip']);
                  }}>
                  随机竖直翻转:
              </Checkbox>
              </Col>
              {randomVerticalFlip && <Col>
                <Form.Item className={'no_margin_bootom'} name={['RandomVerticalFlip', 'p']} label="概率:">
                  <InputNumber min={0} step={0.1} />
                </Form.Item>
              </Col>
              }
            </Row>
          </FormItem>
          <FormItem>
            <Row justify="left" wrap={false}>
              <Col span={4} style={{ textAlign: "right" }}>
                <Checkbox value="brightness"
                  defaultChecked={brightness}
                  onChange={(e) => {
                    setBrightness(e.target.checked);
                    changeThisNull(form2, e.target.checked, e.target.value, initVals.data.transforms['brightness']);
                  }}
                >
                  随机亮度变化:
              </Checkbox>
              </Col >
              <Col span={4}>
                {brightness && <Row wrap={false}>
                  <Form.Item className={'no_margin_bootom'} name={['ColorJitter', 'brightness']} label="比例">
                    <InputNumber min={0} step={0.1} />
                  </Form.Item>
                </Row>
                }
              </Col>
              <Col span={4} style={{ textAlign: "right" }}>
                <Checkbox value="contrast"
                  defaultChecked={contrast}
                  onChange={(e) => {
                    setContrast(e.target.checked);
                    changeThisNull(form2, e.target.checked, e.target.value, initVals.data.transforms['contrast']);
                  }}>
                  随机对比度:
              </Checkbox>
              </Col>
              <Col span={4}>
                {contrast && <Row wrap={false}>
                  <Form.Item className={'no_margin_bootom'} name={['ColorJitter', 'contrast']} label="概率">
                    <InputNumber min={0} step={0.1} />
                  </Form.Item>
                </Row>
                }
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Row justify="left">
              <Col span={4} style={{ textAlign: "right" }}>
                <Checkbox value={['ColorJitter', 'saturation']}
                  defaultChecked={saturation}
                  onChange={(e) => {
                    setSaturation(e.target.checked);
                    changeThisNull(form2, e.target.checked, e.target.value, initVals.data.transforms['ColorJitter']['saturation']);
                  }}
                >
                  随机饱和度:
                </Checkbox>
              </Col>
              <Col span={3}>
                {saturation && <Form.Item className={'no_margin_bootom'}
                  name={['ColorJitter', 'saturation']} label="概率:">
                  <InputNumber min={0} step={0.1} />
                </Form.Item>
                }
              </Col>
              <Col span={4} style={{ textAlign: "right" }}>
                <Checkbox value="hue"
                  defaultChecked={hueBox}
                  onChange={(e) => {
                    setHueBox(e.target.checked);
                    changeThisNull(form2, e.target.checked, e.target.value, initVals.data.transforms['hue']);
                  }}
                >
                  随机色调:
              </Checkbox>
              </Col>
              <Col span={3} >
                {hueBox && <Form.Item className={'no_margin_bootom'} name={['ColorJitter', 'hue']} label="概率:">
                  <InputNumber min={0} />
                </Form.Item>
                }
              </Col>

              <Col span={4} style={{ textAlign: "right" }}>
                <Checkbox value={'RandomGrayscale'}
                  defaultChecked={randomGrayscale}
                  onChange={(e) => {
                    setRandomGrayscale(e.target.checked);
                    changeThisNull(form2, e.target.checked, e.target.value, initVals.data.transforms['RandomGrayscale']);
                  }}
                >
                  随机灰度化:
              </Checkbox>
              </Col>
              {randomGrayscale && <Col>
                <Form.Item className={'no_margin_bootom'} name={['RandomGrayscale', "p"]} label="概率:">
                  <InputNumber min={0} step={0.1} />
                </Form.Item>
              </Col>}
            </Row>
          </FormItem>

          <Form.Item label="归一化" className={'no_margin_bootom'}>
            <span>均值:</span>
            <Form.Item name={['Normalize', 'mean', 0]} style={{ display: 'inline-block', marginBottom: 0 }}>
              <InputNumber min={0} max={1} step={0.1} />
            </Form.Item>
            <Form.Item name={['Normalize', 'mean', 1]} style={{ display: 'inline-block', marginBottom: 0 }}>
              <InputNumber min={0} max={1} step={0.1} />
            </Form.Item>
            <Form.Item name={['Normalize', 'mean', 2]} style={{ display: 'inline-block', marginBottom: 0 }}>
              <InputNumber min={0} max={1} step={0.1} />
            </Form.Item>
            <br />
              方差:
              <Form.Item name={['Normalize', 'std', 0]} style={{ display: 'inline-block', marginBottom: 0 }}>
              <InputNumber min={0} max={1} step={0.1} />
            </Form.Item>
            <Form.Item name={['Normalize', 'std', 1]} style={{ display: 'inline-block', marginBottom: 0 }}>
              <InputNumber min={0} max={1} step={0.1} />
            </Form.Item>
            <Form.Item name={['Normalize', 'std', 2]} style={{ display: 'inline-block', marginBottom: 0 }}>
              <InputNumber min={0} max={1} step={0.1} />
            </Form.Item>
          </Form.Item>
        </Form>
            网络结构:
         <Form {...layout} form={form3} name="network"
          size={"small"}
          initialValues={dataVals.network}
          validateMessages={validateMessages}
        >
          <Form.Item name={['model', 'model']} label="模型选择" rules={[{ required: true }]}>
            <Select style={{ width: 200 }}>
              {modelOptions}
            </Select>
          </Form.Item>
          <Form.Item label="自定义顶层MLP">
            <Switch checkedChildren="开启" defaultChecked={fullyConnectedHead} unCheckedChildren="关闭" onChange={changeFullyConnected} />
          </Form.Item>
          <div style={{ display: fullyConnectedHead ? "block" : "none" }}>
            <Form.List name={['custom_head']}>
              {(fields) => (
                <>
                  {fields.map(({ key, name }) => {
                    return (
                      <Space key={key} className={'no_margin_bootom'} align="baseline">
                        <Form.Item labelCol={'span:8'} name={[name, 'num_fc']} fieldKey={[name, 'num_fc']} label="全连接层数(不包括输出层)">
                          <InputNumber min={1} />
                        </Form.Item>
                        <Form.Item labelCol={'span:8'} name={[name, 'fc_channels']} fieldKey={[name, 'fc_channels']} label="全连接层神经元数">
                          <InputNumber min={1} />
                        </Form.Item>
                        <Form.Item labelCol={'span:8'} name={[name, 'with_dropout']} fieldKey={[name, 'with_dropout']} label="是否使用dropout">
                          <Radio.Group>
                            <Radio value={true}>是</Radio>
                            <Radio value={false}>否</Radio>
                          </Radio.Group>
                        </Form.Item>
                        <Form.Item labelCol={'span:8'} name={[name, 'keep_prob']} fieldKey={[name, 'keep_prob']} label="Dropout keep prob">
                          <InputNumber min={1} />
                        </Form.Item>
                      </Space>
                    )
                  }
                  )}
                </>
              )}
            </Form.List>
          </div>
          <Form.Item name={'output_act'} label="激活函数" rules={[{ required: true }]}>
            <Radio.Group >
              <Radio value={"Softmax"}>Softmax</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
            训练参数：
        <Form {...layout} form={form4} name="training" size={"small"}
          initialValues={dataVals.training}
          validateMessages={validateMessages}
        >
          <Form.Item name={['learning_rate']} label="初始学习率" rules={[{ required: true }]}>
            <InputNumber min={0} step={0.001} />
          </Form.Item>
          <Form.Item >
            <Row justify="left">
              <Col span={4} style={{ textAlign: "right" }}>
                <Checkbox value={'warmup'}
                  defaultChecked={warmup}
                  onChange={(e) => {
                    setWarmup(e.target.checked);
                    changeThisNull(form4, e.target.checked, e.target.value, initVals.training['warmup']);
                  }}
                >
                  warmup:
                </Checkbox>
              </Col>
              {warmup && <Space>
                <Form.Item className={'no_margin_bootom'} labelCol={'span:8'} name={['warmup', 'epochs']} label="warm up轮数">
                  <InputNumber min={1} value={warmup} />
                </Form.Item>
                <Form.Item className={'no_margin_bootom'} labelCol={'span:8'} name={['warmup', 'method']} label="是否使用dropout">
                  <Radio.Group>
                    <Radio value={'linear'}>linear</Radio>
                    <Radio value={'constant'}>constant</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item className={'no_margin_bootom'} labelCol={'span:8'} name={['warmup', 'factor']} label="比列因子">
                  <InputNumber min={0} max={1} step={0.1} />
                </Form.Item>
              </Space>
              }
            </Row>
          </Form.Item>

          <Form.Item name={'epochs'} label="训练轮次epoch" rules={[{ required: true }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item style={{ display: 'flex' }} >
            <Row>
              <Form.Item className={'no_margin_bootom'} name={'lr_decay_milestones'} label="在哪些epoch之后降低学习率"
                rules={[{
                  required: true,
                  pattern: new RegExp(/^(\d+,?)+$/),
                  message: 'Wrong format!'
                }]}>

                <Input style={{ width: 200 }} />
              </Form.Item>
              <span>(格式:3,6,9)</span>
            </Row>
          </Form.Item>

          <Form.Item name={'lr_decay_ratio'} label="学习率下降系数"
            rules={[{
              required: true
            }]}>
            <InputNumber min={0} step={0.001} />
          </Form.Item>
          <Form.Item name={'optimizer'} label="优化器" rules={[{ required: true }]}>
            <Input style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name={'weight_decay'} label="权重衰减" rules={[{ required: true }]}>
            <InputNumber min={0} step={0.1} />
          </Form.Item>
          <Form.Item name={['gpu_ids', 0]} label="gpu序号" rules={[{ required: true }]}>
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" onClick={handSubmit} style={{ marginRight: 12 }}>
              保存
              </Button>
            <Button type="primary" onClick={OnCheckTrain} >
              启动训练
            </Button>
          </Form.Item>
        </Form>

      </Panel>
    </Collapse >
  );
}

export default ParamConfig;
