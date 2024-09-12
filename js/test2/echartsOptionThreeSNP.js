function getThreeSNPOption(REFData, SNPDataBoth, SNPDataISO, SNPDataRNA) {
    let yAxisCategory = ['T', 'G', 'C', 'A', 'REF'];
    return {
        tooltip: {
            formatter: function (params) {
                // 此时由于trigger是axis，所以params是一个数组，数组中的每一个元素是一个对象，对象中包含了当前点的所有信息
                // 依次遍历数组中的每一个对象，将每一个对象的信息拼接起来
                let result = '';
                params.forEach(function (item) {
                    result += item.marker + item.value[0] + '<br>';
                });
                result += 'Site: ' + params[0].value[1] + ' bp';
                return result;
            }
        },
        title: [
            {
                text: 'SNP With ISO-Seq && RNA-Seq Evidence',
                subtext: 'total count: 444708',
                textStyle: {
                    fontSize: 16,
                    fontWeight: "bold"
                },
                subtextStyle: {
                    fontSize: 14
                },
                left: '50%',
                top: 10,
                textAlign: 'center'
            },
            {
                text: 'SNP With ISO-Seq Evidence',
                subtext: 'total count: 483993',
                textStyle: {
                    fontSize: 16,
                    fontWeight: "bold"
                },
                subtextStyle: {
                    fontSize: 14
                },
                left: '50%',
                top: 350,
                textAlign: 'center'
            },
            {
                text: 'SNP With RNA-Seq Evidence',
                subtext: 'total count: 1253950',
                textStyle: {
                    fontSize: 16,
                    fontWeight: "bold"
                },
                subtextStyle: {
                    fontSize: 14
                },
                left: '50%',
                top: 670,
                textAlign: 'center'
            }
        ],
        xAxis: [
            {
                gridIndex: 0,
                axisLabel: {
                    formatter: function (val) {
                        return Math.round(val) + ' bp';
                    },
                    fontSize: 16
                },
                axisPointer: {
                    type: 'line',
                    show: true,
                    triggerEmphasis: true, // 是否触发强调
                    snap: true, // 是否自动吸附到点
                    label: {
                        fontSize: 18,
                        formatter: function (params) {
                            return Math.round(params.value) + 'bp';
                        }
                    },
                    lineStyle: {
                        width: 3,
                        type: "dashed",
                    }
                }
            },
            {
                gridIndex: 1,
                axisLabel: {
                    formatter: function (val) {
                        return Math.round(val) + ' bp';
                    },
                    fontSize: 16
                },
                axisPointer: {
                    type: 'line',
                    show: true,
                    triggerEmphasis: true, // 是否触发强调
                    snap: true, // 是否自动吸附到点
                    label: {
                        fontSize: 18,
                        formatter: function (params) {
                            return Math.round(params.value) + 'bp';
                        }
                    },
                    lineStyle: {
                        width: 3,
                        type: "dashed",
                    }
                }
            },
            {
                gridIndex: 2,
                axisLabel: {
                    formatter: function (val) {
                        return Math.round(val) + ' bp';
                    },
                    fontSize: 16
                },
                axisPointer: {
                    type: 'line',
                    show: true,
                    triggerEmphasis: true, // 是否触发强调
                    snap: true, // 是否自动吸附到点
                    label: {
                        fontSize: 18,
                        formatter: function (params) {
                            return Math.round(params.value) + 'bp';
                        }
                    },
                    lineStyle: {
                        width: 3,
                        type: "dashed",
                    }
                }
            },

        ],
        yAxis: [
            {
                gridIndex: 0,
                type: 'category',
                data: yAxisCategory,
                axisLabel: {
                    show: true,
                    fontSize: 18,
                    fontWeight: 'bolder',
                    textStyle: {
                        color: function (value) {
                            if (value == 'REF') {
                                return 'rgba(36, 114, 218, 0.4)';
                            } else if (value == 'A') {
                                return 'blue';
                            } else if (value == 'G') {
                                return 'yellow';
                            } else if (value == 'C') {
                                return 'red';
                            } else if (value == 'T') {
                                return 'green';
                            }
                        }
                    }
                }

            },
            {
                gridIndex: 1,
                type: 'category',
                data: yAxisCategory,
                axisLabel: {
                    show: true,
                    fontSize: 18,
                    fontWeight: 'bolder',
                    textStyle: {
                        color: function (value) {
                            if (value == 'REF') {
                                return 'rgba(36, 114, 218, 0.4)';
                            } else if (value == 'A') {
                                return 'blue';
                            } else if (value == 'G') {
                                return 'yellow';
                            } else if (value == 'C') {
                                return 'red';
                            } else if (value == 'T') {
                                return 'green';
                            }
                        }
                    }
                }

            },
            {
                gridIndex: 2,
                type: 'category',
                data: yAxisCategory,
                axisLabel: {
                    show: true,
                    fontSize: 18,
                    fontWeight: 'bolder',
                    textStyle: {
                        color: function (value) {
                            if (value == 'REF') {
                                return 'rgba(36, 114, 218, 0.4)';
                            } else if (value == 'A') {
                                return 'blue';
                            } else if (value == 'G') {
                                return 'yellow';
                            } else if (value == 'C') {
                                return 'red';
                            } else if (value == 'T') {
                                return 'green';
                            }
                        }
                    }
                }

            },
        ],
        grid: [
            {
                // containLabel: true,
                height: 200,
                top: 80,
            },
            {
                // containLabel: true,
                height: 200,
                top: 410,
            },
            {
                // containLabel: true,
                height: 200,
                top: 730,
            }
        ],
        dataZoom: [
            {
                id: 'dataZoomX',
                // xAxisIndex: [0],
                xAxisIndex: [0, 1, 2],
                type: 'slider',
                filterMode: 'weakFilter',
                filterMode: 'none',
                showDataShadow: false,
                labelFormatter: function (value) {
                    return Math.round(value) + 'bp';
                },
                textStyle: {
                    fontSize: 16
                },
                bottom: 30,
                height: 30,
                start: 0,
                end: 99,
                fillerColor: "rgba(36, 114, 218, 0.4)",
                borderRadius: 8,
                moveHandleSize: 20,
                handleSize: 50, //纵向柄条
                showDetail: true

            },
            {
                xAxisIndex: [0, 1, 2],
                type: 'inside',
                filterMode: 'none'
            }
        ],
        toolbox: {
            feature: {
                dataZoom: { show: true },
                // dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true, name: "SNPs && Evidences" },
                // magicType: {
                //     type: ['line', 'bar', 'stack']
                // }

            }
        },
        series: [
            {
                xAxisIndex: 0,
                yAxisIndex: 0,
                name: 'REF',
                type: 'bar',
                tooltip: {
                    formatter: function (params) {
                        // console.log(params);
                        return [
                            params.marker + params.name,
                            'Mosaic ID: ' + params.value[1],
                            'Length: ' + params.value[2] + ' bp',
                        ].join('<br>');
                    }
                },
                data: REFData,
                encode: {
                    x: 2,
                    y: 0
                },
                itemStyle: {
                    color: 'rgba(15, 150, 218, 0.5)',
                    borderRadius: 10
                }
            },
            {
                xAxisIndex: 0,
                yAxisIndex: 0,
                name: 'SNP',
                type: 'scatter',
                // symbolSize: 20,
                tooltip: {
                    formatter: function (params) {
                        // console.log(params);
                        return [
                            params.seriesName,
                            params.marker + params.name,
                            'Site: ' + params.value[1] + ' bp',
                        ].join('<br>');
                    }
                },
                itemStyle: {
                    color: function (params) {
                        // console.log(params);
                        if (params.value[0] == 'A') {
                            return 'blue';
                        } else if (params.value[0] == 'G') {
                            return 'yellow';
                        } else if (params.value[0] == 'C') {
                            return 'red';
                        } else if (params.value[0] == 'T') {
                            return 'green';
                        }
                    }
                },
                data: SNPDataBoth,
                encode: {
                    x: 1,
                    y: 0
                }
            },

            {
                xAxisIndex: 1,
                yAxisIndex: 1,
                name: 'REF',
                type: 'bar',
                tooltip: {
                    formatter: function (params) {
                        // console.log(params);
                        return [
                            params.marker + params.name,
                            'Mosaic ID: ' + params.value[1],
                            'Length: ' + params.value[2] + ' bp',
                        ].join('<br>');
                    }
                },
                data: REFData,
                encode: {
                    x: 2,
                    y: 0
                },
                itemStyle: {
                    color: 'rgba(15, 150, 218, 0.5)',
                    borderRadius: 10
                }
            },
            {
                xAxisIndex: 1,
                yAxisIndex: 1,
                name: 'SNP',
                type: 'scatter',
                // symbolSize: 20,
                tooltip: {
                    formatter: function (params) {
                        // console.log(params);
                        return [
                            params.seriesName,
                            params.marker + params.name,
                            'Site: ' + params.value[1] + ' bp',
                        ].join('<br>');
                    }
                },
                itemStyle: {
                    color: function (params) {
                        // console.log(params);
                        if (params.value[0] == 'A') {
                            return 'blue';
                        } else if (params.value[0] == 'G') {
                            return 'yellow';
                        } else if (params.value[0] == 'C') {
                            return 'red';
                        } else if (params.value[0] == 'T') {
                            return 'green';
                        }
                    }
                },
                data: SNPDataISO,
                encode: {
                    x: 1,
                    y: 0
                }
            },

            {
                xAxisIndex: 2,
                yAxisIndex: 2,
                name: 'REF',
                type: 'bar',
                tooltip: {
                    formatter: function (params) {
                        // console.log(params);
                        return [
                            params.marker + params.name,
                            'Mosaic ID: ' + params.value[1],
                            'Length: ' + params.value[2] + ' bp',
                        ].join('<br>');
                    }
                },
                data: REFData,
                encode: {
                    x: 2,
                    y: 0
                },
                itemStyle: {
                    color: 'rgba(15, 150, 218, 0.5)',
                    borderRadius: 10
                }
            },
            {
                xAxisIndex: 2,
                yAxisIndex: 2,
                name: 'SNP',
                type: 'scatter',
                // symbolSize: 20,
                tooltip: {
                    formatter: function (params) {
                        // console.log(params);
                        return [
                            params.seriesName,
                            params.marker + params.name,
                            'Site: ' + params.value[1] + ' bp',
                        ].join('<br>');
                    }
                },
                itemStyle: {
                    color: function (params) {
                        // console.log(params);
                        if (params.value[0] == 'A') {
                            return 'blue';
                        } else if (params.value[0] == 'G') {
                            return 'yellow';
                        } else if (params.value[0] == 'C') {
                            return 'red';
                        } else if (params.value[0] == 'T') {
                            return 'green';
                        }
                    }
                },
                data: SNPDataRNA,
                encode: {
                    x: 1,
                    y: 0
                }
            }
        ]
    };
}

export { getThreeSNPOption }