import HashTreeElement from "@/jmeter/utils/hashtree";
import {DataSet} from "@antv/data-set";

export const TYPE = "Reporter";

export default class Reporter extends HashTreeElement {
  constructor(options = {}) {
    super(options)
    this.$type = TYPE;
  }
}

export const schema = {
  Reporter: Reporter
}

export const userDv = new DataSet.DataView()
  .transform({
    type: 'rename',
    map: {
      startedThreads: '虚拟用户数'
    }
  })
  .transform({
    type: 'fold',
    fields: ['虚拟用户数'],
    key: 'stat',
    value: 'count',
    retains: ['ts']
  });

export const tpsDv = new DataSet.DataView()
  .transform({
    type: 'rename',
    map: {
      succeed: '成功',
      failed: '失败'
    }
  })
  .transform({
    type: 'fold',
    fields: ['成功', '失败'],
    key: 'stat',
    value: 'count',
    retains: ['ts']
  });

export const rpsDv = new DataSet.DataView()
  .transform({
    type: 'rename',
    map: {
      samples: '样本数'
    }
  })
  .transform({
    type: 'fold',
    fields: ['样本数'],
    key: 'stat',
    value: 'count',
    retains: ['ts']
  });

export const succeedPercentileDv = new DataSet.DataView()
  .transform({
    type: 'rename',
    map: {
      succeedNinety: '成功-90',
      succeedNinetyFive: '成功-95',
      succeedNinetyNine: '成功-99',
      succeedMedian: '成功-中位数'
    }
  })
  .transform({
    type: 'fold',
    fields: ['成功-99', '成功-95', '成功-90', '成功-中位数'],
    key: 'percentile',
    value: 'count',
    retains: ['ts']
  });

export const failedPercentileDv = new DataSet.DataView()
  .transform({
    type: 'rename',
    map: {
      failedNinety: '失败-90',
      failedNinetyFive: '失败-95',
      failedNinetyNine: '失败-99',
      failedMedian: '失败-中位数'
    }
  })
  .transform({
    type: 'fold',
    fields: ['失败-99', '失败-95', '失败-90', '失败-中位数'],
    key: 'percentile',
    value: 'count',
    retains: ['ts']
  });

export const elapsedTimeDv = new DataSet.DataView()
  .transform({
    type: 'rename',
    map: {
      avgSucceedElapsedTime: '成功',
      avgFailedElapsedTime: '失败'
    }
  })
  .transform({
    type: 'fold',
    fields: ['成功', '失败'],
    key: 'stat',
    value: 'count',
    retains: ['ts']
  });

export const percentileColorMap = {
  '成功-99': '#E3F4BF',
  '成功-95': '#86E6C8',
  '成功-90': '#209BDD',
  '成功-中位数': '#0860BF',
  '失败-99': '#D8D65A',
  '失败-95': '#EC7743',
  '失败-90': '#D85A5A',
  '失败-中位数': '#CB2920'
};
