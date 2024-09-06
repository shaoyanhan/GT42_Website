// 用于绘图和数据处理的全局变量
// 不能将数据定义放在main.js中，因为会导致main.js和echartsOptionHaplotype.js、echartsOptionTranscript.js之间的循环依赖问题


// {
//     "type": "haplotype",
//         "data": [
//             {
//                 "mosaicID": "GT42G000002",
//                 "geneID": "GT42G000002.SO.0",
//                 "areaType": "mosaic",
//                 "length": 5420,
//                 "nucleotideSequence": "ATCGATCG",
//                 "id": 6
//             },
//         ]
// }
let haplotypeRawData = {};
let SNPRawData = {};
let transcriptRawData = {};
let mosaicTPMRawData = {};
let xenologousTPMRawData = {};
let geneTPMRawData = {};
let transcriptTPMRawData = {};
let allTranscriptTPMRawData = {};


// [
//     {
//          "mosaicID": "GT42G000002",
//          "geneID": "GT42G000002.SO.0",
//          "areaType": "mosaic",
//          "length": 5420,
//          "nucleotideSequence": "ATCGATCG",
//     },
// ]
let haplotypeObjectData = [];
let SNPObjectData = [];
let transcriptObjectData = [];
let mosaicTPMObjectData = [];
let xenologousTPMObjectData = [];
let geneTPMObjectData = [];
let transcriptTPMObjectData = [];
let allTranscriptTPMObjectData = [];


// [
//     ["GT42G000002", "GT42G000002.SO.0", "mosaic", 5420, "ATCGATCG"],
// ]
let haplotypeArrayData = [];
let SNPArrayData = [];
let transcriptArrayData = [];


// [
//     ["ID", num, num ...],
// ]
let mosaicTPMArrayData = [];
let xenologousTPMArrayData = [];
let geneTPMArrayData = [];
let transcriptTPMArrayData = [];
let allTranscriptTPMArrayData = [];


/*
{
    "numPages": 1,
    "currentPage": 1,
    "pageSize": 10,
    "totalRecords": 4,
    "searchKeyword": "GT42G000001",
    "type": "haplotypePagination",
    "data": [
        {
            "mosaicID": "GT42G000001",
            "geneID": "GT42G000001.SO.0",
            "areaType": "mosaic",
            "length": 5420,
            "nucleotideSequence": "ATCGATCG",
            "id": 1
        },
    ]
}
*/
let haplotypePaginationData = {};
let SNPPaginationData = {};
let transcriptPaginationData = {};
let allTranscriptPaginationData = {};

let mosaicTPMPaginationData = {};
let xenologousTPMPaginationData = {};
let geneTPMPaginationData = {};
let transcriptTPMPaginationData = {};
let allTranscriptTPMPaginationData = {};

let mosaicNetworkNodesPaginationData = {};
let mosaicNetworkEdgesPaginationData = {};
let xenologousNetworkNodesPaginationData = {};
let xenologousNetworkEdgesPaginationData = {};
let geneNetworkNodesPaginationData = {};
let geneNetworkEdgesPaginationData = {};

let SNPEvidenceBothPaginationData = {};
let SNPEvidenceIsoSeqPaginationData = {};
let SNPEvidenceRNASeqPaginationData = {};


/*
$vars: (3) ['seriesName', 'name', 'value']
borderColor: undefined
color: "#003666"
componentIndex: 1
componentSubType: "scatter"
componentType: "series"
data: (9) ['GT42G000001', 'mosaic', 32, 'C/G', '8346/3244', '2133/4543', 'GT42G000001.SO.1:C; GT42G000001.SS.1:A', '#003666', 2]
dataIndex:1
dataTyp: undefined
dimensionNames: (9) ['value', 'y', 'x', 'value0', 'value1', 'value2', 'value3', 'value4', 'value5']
encode: {y: Array(1), x: Array(1)}
event: {type: 'click', event: PointerEvent, target: i, topTarget: i, cancelBubble: false, …}
name: "mosaic"
seriesId: "\u0000SNP\u00000"
seriesIndex: 1
seriesName: "SNP"
seriesType: "scatter"
type: "click"
value: (9) ['GT42G000001', 'mosaic', 32, 'C/G', '8346/3244', '2133/4543', 'GT42G000001.SO.1:C; GT42G000001.SS.1:A', '#003666', 2]
[[Prototype]]: Object
*/
let haplotypeEchartParamsData = {};
let SNPEchartParamsData = {};
let transcriptEchartParamsData = {};

// 用于记录转录本图像中的外显子的上一个焦点元素所对应的dataIndex
let formerTranscriptHighlightIndex = -1;

// 与PreviousID和NextID组件相关的一系列参数
let currentGenome = 'GT42'; // 记录Select Genome选择框的当前值
let currentIDIndex = 1; // 记录当前ID在next_id_table中的索引
let nextSearchID = 'GT42G000001'; // 记录next_id_table中currentIDIndex索引所对应的ID
let previousSearchID = 'GT42G000001'; // 记录上一个搜索的ID


// {
//     "nodes": [
//         {
//             "name": "GT42G000932.SS.3",
//             "symbolSize": 5.0689,
//             "itemStyle": {
//                 "color": "#b1b134"
//             },
//             "totalDegree": 159,
//             "inDegree": 9,
//             "outDegree": 150
//         },
//         ...
//     ],
//     "edges": [
//         {
//             "source": "GT42G000932.SS.3",
//             "target": "GT42G016300.SO.1",
//             "lineStyle": {
//                 "color": "#b1b134"
//             },
//             "weight": 10.03
//         },
//         ...
//     ]
// }
let mosaicHubNetworkGraphJSON = {};
let xenologousHubNetworkGraphJSON = {};
let geneHubNetworkGraphJSON = {};

// {
//     "nodes": [
//        {
//             "name": "GT42G000016",
//             "symbolSize": "1.3863",
//             "itemStyle": {
//                 "color": "#eb0973"
//             },
//             "totalDegree": 4,
//             "inDegree": 4,
//             "outDegree": 0,
//             "adjacency": [
//                 "GT42G019959",
//                 "GT42G009304",
//                 "GT42G004388",
//                 "GT42G009995"
//             ]
//         },
//         ...
//     ],
//     "edges": [
//         {
//             "source": "GT42G004388",
//             "target": "GT42G014128",
//             "lineStyle": {
//                 "width": "6.8989",
//                 "color": "#96cbb3"
//             }
//         },
//         ...
//     ]
// }
let mosaicSingleNetworkGraphJSON = {};
let xenologousSingleNetworkGraphJSON = {};
let geneSingleNetworkGraphJSON = {};

let currentHubNetworkType = '';
let currentSingleNetworkType = '';
let mosaicCurrentSearchKeyword = '';
let xenologousCurrentSearchKeyword = '';
let geneCurrentSearchKeyword = '';

// 用于实现将 currentHubNetworkType 的值映射到对应的单网络图JSON数据
let resolutionToSingleNetworkGraphJSON = {
    'mosaic': mosaicSingleNetworkGraphJSON,
    'xenologous': xenologousSingleNetworkGraphJSON,
    'gene': geneSingleNetworkGraphJSON,
};

// 用于存储一个mosaic附属的所有ID
// {
//     "mosaic": [
//         "GT42G000016"
//     ],
//     "xenologous": [
//         "GT42G000016.SO"
//     ],
//     "gene": [
//         "GT42G000016.SO.1"
//     ],
//     "transcript": [
//         "GT42G000016.SO.1.1",
//         "GT42G000016.SO.1.2",
//     ]
// }
let homologousIDSet = {};

let firstInitialCoExpressionNetworkGraph = true;

// mosaicID	Ca1_1	Ca1_2	Ca1_3	Ca2_1	Ca2_2	Ca2_3	Ca3_1	Ca3_2	Ca3_3	Ro1_1	Ro1_2	Ro1_3	Ro2_1	Ro2_2	Ro2_3	Le1_1	Le1_2	Le1_3	LS1_1	LS1_2	LS1_3	Bu1_1	Bu1_2	Bu1_3	In1_1	In1_2	In1_3	NR1_1	NR1_2	NR1_3	AM_1	AM_2	AM_3	Bu2_1	Bu2_2	Bu2_3	Sp_1	Sp_2	Sp_3	Br_1	Br_2	Br_3	St_1	St_2	St_3	Pi_1	Pi_2	Pi_3	Gl_2	Gl_3	LS2_2	LS2_3	In2_1	In2_3	No2_1	No2_2	No2_3	Bu3_1	Bu3_3	Le2_1	Le2_2	Le2_3
let TPM_data_table_download_keys_to_keep = ['mosaicID', 'Ca1_1', 'Ca1_2', 'Ca1_3', 'Ca2_1', 'Ca2_2', 'Ca2_3', 'Ca3_1', 'Ca3_2', 'Ca3_3', 'Ro1_1', 'Ro1_2', 'Ro1_3', 'Ro2_1', 'Ro2_2', 'Ro2_3', 'Le1_1', 'Le1_2', 'Le1_3', 'LS1_1', 'LS1_2', 'LS1_3', 'Bu1_1', 'Bu1_2', 'Bu1_3', 'In1_1', 'In1_2', 'In1_3', 'NR1_1', 'NR1_2', 'NR1_3', 'AM_1', 'AM_2', 'AM_3', 'Bu2_1', 'Bu2_2', 'Bu2_3', 'Sp_1', 'Sp_2', 'Sp_3', 'Br_1', 'Br_2', 'Br_3', 'St_1', 'St_2', 'St_3', 'Pi_1', 'Pi_2', 'Pi_3', 'Gl_2', 'Gl_3', 'LS2_2', 'LS2_3', 'In2_1', 'In2_3', 'No2_1', 'No2_2', 'No2_3', 'Bu3_1', 'Bu3_3', 'Le2_1', 'Le2_2', 'Le2_3'];

let SNPEvidenceBothObjectData = [];
let SNPEvidenceIsoSeqObjectData = [];
let SNPEvidenceRNASeqObjectData = [];


// blastResults 的结构：
// {
//     "format0": "BLASTP 2.16.0+\n\n\nReference: Stephen F. Altschul, Thomas L. Madden, Alejandro A.\nSchaffer, Jinghui Zhang, Zheng Zhang, Webb Miller, and David J.\nLipman (1997), \"Gapped BLAST and PSI-BLAST: a new generation of\nprotein database search programs\", Nucleic Acids Res. 25:3389-3402.\n\n\nReference for composition-based statistics: Alejandro A. Schaffer,\nL. Aravind, Thomas L. Madden, Sergei Shavirin, John L. Spouge, Yuri\nI. Wolf, Eugene V. Koonin, and Stephen F. Altschul (2001),\n\"Improving the accuracy of PSI-BLAST protein database searches with\ncomposition-based statistics and other refinements\", Nucleic Acids\nRes. 29:2994-3005.\n\n\n\nDatabase: D:\\研究生项目\\GT42_Website\\data\\transcriptome\\transcriptome.final.pe\np\n           292,099 sequences; 131,431,772 total letters\n\n\n\nQuery= q1\n\nLength=8\n\n\n***** No hits found *****\n\n\n\nLambda      K        H        a         alpha\n   0.322    0.138    0.462    0.792     4.96 \n\nGapped\nLambda      K        H        a         alpha    sigma\n   0.267   0.0410    0.140     1.90     42.6     43.6 \n\nEffective search space used: 1051454176\n\n\n  Database: D:\\研究生项目\\GT42_Website\\data\\transcriptome\\transcriptome.final.pe\np\n    Posted date:  Aug 5, 2024  9:48 PM\n  Number of letters in database: 131,431,772\n  Number of sequences in database:  292,099\n\n\n\nMatrix: BLOSUM62\nGap Penalties: Existence: 11, Extension: 1\nNeighboring words threshold: 11\nWindow for multiple hits: 40\n",
//     "format7": "# BLASTP 2.16.0+\n# Query: q1\n# Database: transcript_peptide\n# 0 hits found\n# BLAST processed 1 queries\n",
//     "format15": [
//         {
//             "report": {
//                 "program": "blastp",
//                 "version": "BLASTP 2.16.0+",
//                 "reference": "Stephen F. Altschul, Thomas L. Madden, Alejandro A. Sch&auml;ffer, Jinghui Zhang, Zheng Zhang, Webb Miller, and David J. Lipman (1997), \"Gapped BLAST and PSI-BLAST: a new generation of protein database search programs\", Nucleic Acids Res. 25:3389-3402.",
//                 "search_target": {
//                     "db": "transcript_peptide"
//                 },
//                 "params": {
//                     "matrix": "BLOSUM62",
//                     "expect": 10,
//                     "gap_open": 11,
//                     "gap_extend": 1,
//                     "filter": "F",
//                     "cbs": 2
//                 },
//                 "results": {
//                     "search": {
//                         "query_id": "Query_1",
//                         "query_title": "q1",
//                         "query_len": 8,
//                         "hits": [],
//                         "stat": {
//                             "db_num": 292099,
//                             "db_len": 131431772,
//                             "hsp_len": 0,
//                             "eff_space": 1051454176,
//                             "kappa": 0.041,
//                             "lambda": 0.267,
//                             "entropy": 0.14
//                         },
//                         "message": "No hits found"
//                     }
//                 }
//             }
//         }
//     ]
// }
let blastResultPairwiseAlignment = "";
let blastResultDetailedTable = "";
let blastResultSingleJSON = [];
let blastResultQueryTableStringList = [];
let blastQueryIDList = [];
let currentBlastQuerySeqType = 'nucleotide';
let currentBlastResultQueryIndex = 0;
let blastResultSeqType = 'nucleotide';


// 定义API请求的前缀
let apiPrefix = {
    IP: 'http://127.0.0.1:8080/',

    app: 'searchDatabase/',

    haplotype: 'getHaplotypeTable/',
    SNP: 'getSNPTable/',
    // transcript 和 allTranscript共用一套存储变量，因为fullLengthTranscriptome.html同一时间只会出现一种transcript数据
    // pagination数据也是一样的
    transcript: 'getTranscriptTable/',
    allTranscript: 'getAllTranscriptTable/',
    mosaicTPM: 'getMosaicTPMTable/',
    xenologousTPM: 'getXenologousTPMTable/',
    geneTPM: 'getGeneTPMTable/',
    transcriptTPM: 'getTranscriptTPMTable/',
    allTranscriptTPM: 'getAllTranscriptTPMTable/',
    SNPEvidenceBoth: 'getSNPEvidenceBothTable/',
    SNPEvidenceIsoSeq: 'getSNPEvidenceIsoSeqTable/',
    SNPEvidenceRNASeq: 'getSNPEvidenceRNASeqTable/',

    haplotypePagination: 'getHaplotypeTableByPage/',
    SNPPagination: 'getSNPTableByPage/',
    transcriptPagination: 'getTranscriptTableByPage/',
    allTranscriptPagination: 'getAllTranscriptTableByPage/',
    mosaicTPMPagination: 'getMosaicTPMTableByPage/',
    xenologousTPMPagination: 'getXenologousTPMTableByPage/',
    geneTPMPagination: 'getGeneTPMTableByPage/',
    transcriptTPMPagination: 'getTranscriptTPMTableByPage/',
    allTranscriptTPMPagination: 'getAllTranscriptTPMTableByPage/',
    mosaicNetworkNodesPagination: 'getMosaicNetworkNodesTableByPage/',
    mosaicNetworkEdgesPagination: 'getMosaicNetworkEdgesTableByPage/',
    xenologousNetworkNodesPagination: 'getXenologousNetworkNodesTableByPage/',
    xenologousNetworkEdgesPagination: 'getXenologousNetworkEdgesTableByPage/',
    geneNetworkNodesPagination: 'getGeneNetworkNodesTableByPage/',
    geneNetworkEdgesPagination: 'getGeneNetworkEdgesTableByPage/',
    SNPEvidenceBothPagination: 'getSNPEvidenceBothTableByPage/',
    SNPEvidenceIsoSeqPagination: 'getSNPEvidenceIsoSeqTableByPage/',
    SNPEvidenceRNASeqPagination: 'getSNPEvidenceRNASeqTableByPage/',

    validateGenomeID: 'validateGenomeID/',

    GT42NextID: 'getGT42NextID/',

    hubNetworkGraphJSON: 'getNetworkGraphJSONFile/',
    singleNetworkGraphJSON: 'getNetworkGraphJSON/',

    homologousIDSet: 'getHomologousIDSet/',

    // 该数据并没有进行任何存储操作，只是用于下载表格
    homePageStatisticData: 'getHomePageStatisticData/',

    blastResults: 'getBlastResults/',

    parameter: {
        searchKeyword: 'searchKeyword=',
        page: 'page=',
        genomeID: 'genomeID=',
        currentIDIndex: 'currentIDIndex=',
        networkType: 'type=',
    }
}
// 定义更新函数的映射关系, 从名称映射到函数
const updateDataFunctions = {
    haplotype: updateHaplotypeData,
    SNP: updateSNPData,
    transcript: updateTranscriptData,
    mosaicTPM: updateMosaicTPMData,
    xenologousTPM: updateXenologousTPMData,
    geneTPM: updateGeneTPMData,
    transcriptTPM: updateTranscriptTPMData,
    allTranscriptTPM: updateAllTranscriptTPMData,
    SNPEvidenceBoth: updateSNPEvidenceBothData,
    SNPEvidenceIsoSeq: updateSNPEvidenceIsoSeqData,
    SNPEvidenceRNASeq: updateSNPEvidenceRNASeqData,

    haplotypePagination: updateHaplotypePaginationData,
    SNPPagination: updateSNPPaginationData,
    transcriptPagination: updateTranscriptPaginationData,
    allTranscriptPagination: updateAllTranscriptPaginationData,
    mosaicTPMPagination: updateMosaicTPMPaginationData,
    xenologousTPMPagination: updateXenologousTPMPaginationData,
    geneTPMPagination: updateGeneTPMPaginationData,
    transcriptTPMPagination: updateTranscriptTPMPaginationData,
    allTranscriptTPMPagination: updateAllTranscriptTPMPaginationData,
    mosaicNetworkNodesPagination: updateMosaicNetworkNodesPaginationData,
    mosaicNetworkEdgesPagination: updateMosaicNetworkEdgesPaginationData,
    xenologousNetworkNodesPagination: updateXenologousNetworkNodesPaginationData,
    xenologousNetworkEdgesPagination: updateXenologousNetworkEdgesPaginationData,
    geneNetworkNodesPagination: updateGeneNetworkNodesPaginationData,
    geneNetworkEdgesPagination: updateGeneNetworkEdgesPaginationData,
    SNPEvidenceBothPagination: updateSNPEvidenceBothPaginationData,
    SNPEvidenceIsoSeqPagination: updateSNPEvidenceIsoSeqPaginationData,
    SNPEvidenceRNASeqPagination: updateSNPEvidenceRNASeqPaginationData,

    haplotypeEchartParams: updateHaplotypeEchartParamsData,
    SNPEchartParams: updateSNPEchartParamsData,
    transcriptEchartParams: updateTranscriptEchartParamsData,

    formerTranscriptHighlightIndex: updateFormerTranscriptHighlightIndex,

    nextIDData: updateNextIDData,
    currentGenome: updateCurrentGenome,
    currentIDIndex: updateCurrentIDIndex,
    nextSearchID: updateNextSearchID,

    mosaicHubNetworkGraphJSON: updateMosaicHubNetworkGraphJSON,
    xenologousHubNetworkGraphJSON: updateXenologousHubNetworkGraphJSON,
    geneHubNetworkGraphJSON: updateGeneHubNetworkGraphJSON,

    mosaicSingleNetworkGraphJSON: updateMosaicSingleNetworkGraphJSON,
    xenologousSingleNetworkGraphJSON: updateXenologousSingleNetworkGraphJSON,
    geneSingleNetworkGraphJSON: updateGeneSingleNetworkGraphJSON,

    currentHubNetworkType: updateCurrentHubNetworkType,
    currentSingleNetworkType: updateCurrentSingleNetworkType,
    mosaicCurrentSearchKeyword: updateMosaicCurrentSearchKeyword,
    xenologousCurrentSearchKeyword: updateXenologousCurrentSearchKeyword,
    geneCurrentSearchKeyword: updateGeneCurrentSearchKeyword,

    homologousIDSet: updateHomologousIDSet,

    firstInitialCoExpressionNetworkGraph: updateFirstInitialCoExpressionNetworkGraph,

    blastResult: updateBlastResult,
    currentBlastQuerySeqType: updateCurrentBlastQuerySeqType,
    currentBlastResultQueryIndex: updateCurrentBlastResultQueryIndex,
    blastResultSeqType: updateBlastResultSeqType,

};

// 定义获取数据的映射关系, 从名称映射到函数
const getDataFunctions = {
    haplotypeRawData: getHaplotypeRawData,
    SNPRawData: getSNPRawData,
    transcriptRawData: getTranscriptRawData,
    mosaicTPMRawData: getMosaicTPMRawData,
    xenologousTPMRawData: getXenologousTPMRawData,
    geneTPMRawData: getGeneTPMRawData,
    transcriptTPMRawData: getTranscriptTPMRawData,
    allTranscriptTPMRawData: getAllTranscriptTPMRawData,

    haplotypeObjectData: getHaplotypeObjectData,
    SNPObjectData: getSNPObjectData,
    transcriptObjectData: getTranscriptObjectData,
    mosaicTPMObjectData: getMosaicTPMObjectData,
    xenologousTPMObjectData: getXenologousTPMObjectData,
    geneTPMObjectData: getGeneTPMObjectData,
    transcriptTPMObjectData: getTranscriptTPMObjectData,
    allTranscriptTPMObjectData: getAllTranscriptTPMObjectData,
    SNPEvidenceBothObjectData: getSNPEvidenceBothObjectData,
    SNPEvidenceIsoSeqObjectData: getSNPEvidenceIsoSeqObjectData,
    SNPEvidenceRNASeqObjectData: getSNPEvidenceRNASeqObjectData,

    haplotypeArrayData: getHaplotypeArrayData,
    SNPArrayData: getSNPArrayData,
    transcriptArrayData: getTranscriptArrayData,
    mosaicTPMArrayData: getMosaicTPMArrayData,
    xenologousTPMArrayData: getXenologousTPMArrayData,
    geneTPMArrayData: getGeneTPMArrayData,
    transcriptTPMArrayData: getTranscriptTPMArrayData,
    allTranscriptTPMArrayData: getAllTranscriptTPMArrayData,

    haplotypePaginationData: getHaplotypePaginationData,
    SNPPaginationData: getSNPPaginationData,
    transcriptPaginationData: getTranscriptPaginationData,
    allTranscriptPaginationData: getAllTranscriptPaginationData,
    mosaicTPMPaginationData: getMosaicTPMPaginationData,
    xenologousTPMPaginationData: getXenologousTPMPaginationData,
    geneTPMPaginationData: getGeneTPMPaginationData,
    transcriptTPMPaginationData: getTranscriptTPMPaginationData,
    allTranscriptTPMPaginationData: getAllTranscriptTPMPaginationData,
    mosaicNetworkNodesPaginationData: getMosaicNetworkNodesPaginationData,
    mosaicNetworkEdgesPaginationData: getMosaicNetworkEdgesPaginationData,
    xenologousNetworkNodesPaginationData: getXenologousNetworkNodesPaginationData,
    xenologousNetworkEdgesPaginationData: getXenologousNetworkEdgesPaginationData,
    geneNetworkNodesPaginationData: getGeneNetworkNodesPaginationData,
    geneNetworkEdgesPaginationData: getGeneNetworkEdgesPaginationData,
    SNPEvidenceBothPaginationData: getSNPEvidenceBothPaginationData,
    SNPEvidenceIsoSeqPaginationData: getSNPEvidenceIsoSeqPaginationData,
    SNPEvidenceRNASeqPaginationData: getSNPEvidenceRNASeqPaginationData,

    haplotypeEchartParamsData: getHaplotypeEchartParamsData,
    SNPEchartParamsData: getSNPEchartParamsData,
    transcriptEchartParamsData: getTranscriptEchartParamsData,

    formerTranscriptHighlightIndex: getFormerTranscriptHighlightIndex,

    currentGenome: getCurrentGenome,
    currentIDIndex: getCurrentIDIndex,
    nextSearchID: getNextSearchID,
    previousSearchID: getPreviousSearchID,

    mosaicHubNetworkGraphJSON: getMosaicHubNetworkGraphJSON,
    xenologousHubNetworkGraphJSON: getXenologousHubNetworkGraphJSON,
    geneHubNetworkGraphJSON: getGeneHubNetworkGraphJSON,

    mosaicSingleNetworkGraphJSON: getMosaicSingleNetworkGraphJSON,
    xenologousSingleNetworkGraphJSON: getXenologousSingleNetworkGraphJSON,
    geneSingleNetworkGraphJSON: getGeneSingleNetworkGraphJSON,

    currentHubNetworkType: getCurrentHubNetworkType,
    currentSingleNetworkType: getCurrentSingleNetworkType,
    mosaicCurrentSearchKeyword: getMosaicCurrentSearchKeyword,
    xenologousCurrentSearchKeyword: getXenologousCurrentSearchKeyword,
    geneCurrentSearchKeyword: getGeneCurrentSearchKeyword,

    homologousIDSet: getHomologousIDSet,

    haplotype_data_table_download: getDownloadHaplotypeTable,
    SNP_data_table_download: getDownloadSNPTable,
    transcript_data_table_download: getDownloadTranscriptTable,
    mosaic_TPM_data_table_download: getDownloadMosaicTPMTable,
    xenologous_TPM_data_table_download: getDownloadXenologousTPMTable,
    gene_TPM_data_table_download: getDownloadGeneTPMTable,
    transcript_TPM_data_table_download: getDownloadTranscript,
    all_transcript_TPM_data_table_download: getDownloadAllTranscriptTPMTable,
    single_network_nodes_table_download: getDownloadSingleNetworkNodesTable,
    single_network_edges_table_download: getDownloadSingleNetworkEdgesTable,
    SNP_evidence_table_both_download: getDownloadSNPEvidenceBothTable,
    SNP_evidence_table_iso_download: getDownloadSNPEvidenceIsoSeqTable,
    SNP_evidence_table_rna_download: getDownloadSNPEvidenceRNASeqTable,

    firstInitialCoExpressionNetworkGraph: getFirstInitialCoExpressionNetworkGraph,

    blastResultPairwiseAlignment: getBlastResultPairwiseAlignment,
    blastResultDetailedTable: getBlastResultDetailedTable,
    blastResultSingleJSON: getBlastResultSingleJSON,
    blastResultQueryTableStringList: getBlastResultQueryTableStringList,
    blastQueryIDList: getBlastQueryIDList,
    currentBlastQuerySeqType: getCurrentBlastQuerySeqType,
    currentBlastResultQueryIndex: getCurrentBlastResultQueryIndex,
    blastResultSeqType: getBlastResultSeqType,

};

// 将对象数组转换为二维数组
function objectToArray(data) {
    return data.map(element => Object.values(element));
}

// 从对象数组中过滤出指定的键以及对应的值
function filterKeysInObjects(objects, keys) {
    return objects.map(object => {
        let filteredObject = {};
        keys.forEach(key => {
            if (object.hasOwnProperty(key)) {
                filteredObject[key] = object[key];
            }
        });
        return filteredObject;
    });
}

function extractTableFromBlastResultFormat7(resultString) {
    // format7的BLAST结果字符串如下
    // const result_str = `# BLASTP 2.16.0+
    // # Query: q1
    // # Database: transcript_peptide
    // # Fields: query id, subject id, % identity, alignment length, mismatches, gap opens, q. start, q. end, s. start, s. end, evalue, bit score, query/sbjct frames
    // # 18 hits found
    // q1	GT42G017641.SO.1.1	100.000	186	0	0	1	186	1	186	2.84e-127	357	1/1
    // q1	GT42G004718.SO.4.5	36.471	85	42	5	71	150	52	129	2.2	32.0	1/1
    // # BLASTP 2.16.0+
    // # Query: q2
    // # Database: transcript_peptide
    // # Fields: query id, subject id, % identity, alignment length, mismatches, gap opens, q. start, q. end, s. start, s. end, evalue, bit score, query/sbjct frames
    // # 0 hits found
    // # BLAST processed 2 queries`;


    // 第一步：按 "# Query:" 进行切割
    let queryResults = resultString.split(/# Query:/);


    // 第二步：跳过第一个切割结果并处理每个独立的query内容
    let queryTableStringList = queryResults.slice(1).map(result => {
        // 查找 "# n hits found" 注释行
        let hitCountLine = result.split('\n').find(line => line.includes('hits found'));

        // 如果是 "# 0 hits found"，直接返回 "", 这里必须加上#，否则10 hits found之类也会被匹配到
        if (hitCountLine.includes('# 0 hits found')) {
            return '';
        } else {
            // 否则处理 "n hits found" 的情况
            let hitsInfo = result.split('hits found')[1].split('#')[0].trim();
            return hitsInfo;
        }
    });

    return queryTableStringList;
}

function extractQueryIDListFromBlastResultFormat7(resultString) {
    // format7的BLAST结果字符串如下
    // // # BLASTP 2.16.0+
    // // # Query: q1
    // // # Database: transcript_peptide
    // // # 0 hits found
    // // # BLASTP 2.16.0+
    // // # Query: q2
    // // # Database: transcript_peptide
    // // # 0 hits found
    // // # BLAST processed 2 queries`;

    // 获取 Query_id 列表
    let queryIDList = [];
    let queryLines = resultString.split('\n');

    // 遍历每一行，找到以 "# Query:" 开头的行，提取其中的 Query ID，如果没有则使用 "Query_" + index 作为 Query ID
    queryLines.forEach((line, index) => {
        if (line.startsWith('# Query:')) {
            let queryID = line.split('# Query:')[1].trim();
            if (queryID) {
                queryIDList.push(queryID);
            } else {
                queryIDList.push('Query_' + index);
            }
        }
    });

    return queryIDList;
}

// 更新数据，因为在ES6模块中，通过import导入的变量是只读的，不能被重新赋值。
function updateHaplotypeData(newData) {
    haplotypeRawData = newData;
    haplotypeObjectData = newData.data;
    haplotypeArrayData = objectToArray(newData.data);
}
function updateSNPData(newData) {
    // console.log(newData);
    SNPRawData = newData;
    SNPObjectData = newData.data;
    SNPArrayData = objectToArray(newData.data);
}
function updateTranscriptData(newData) {
    transcriptRawData = newData;
    transcriptObjectData = newData.data;
    transcriptArrayData = objectToArray(newData.data);
}
function updateMosaicTPMData(newData) {
    mosaicTPMRawData = newData;
    mosaicTPMObjectData = newData.data;
    mosaicTPMArrayData = objectToArray(newData.data);
}
function updateXenologousTPMData(newData) {
    xenologousTPMRawData = newData;
    xenologousTPMObjectData = newData.data;
    // 将object转换为数组并去除每个元素的mosaicID列
    xenologousTPMArrayData = objectToArray(newData.data).map(element => element.slice(1));
}
function updateGeneTPMData(newData) {
    geneTPMRawData = newData;
    geneTPMObjectData = newData.data;
    // 将object转换为数组并去除每个元素的mosaicID和xenologous列
    geneTPMArrayData = objectToArray(newData.data).map(element => element.slice(2));
}
function updateTranscriptTPMData(newData) {
    transcriptTPMRawData = newData;
    transcriptTPMObjectData = newData.data;
    // 将object转换为数组并去除每个元素的mosaicID、xenologous和gene列
    transcriptTPMArrayData = objectToArray(newData.data).map(element => element.slice(3));
}
function updateAllTranscriptTPMData(newData) {
    allTranscriptTPMRawData = newData;
    allTranscriptTPMObjectData = newData.data;
    allTranscriptTPMArrayData = objectToArray(newData.data).map(element => element.slice(3));
}
function updateSNPEvidenceBothData(newData) {
    SNPEvidenceBothObjectData = newData.data;
}
function updateSNPEvidenceIsoSeqData(newData) {
    SNPEvidenceIsoSeqObjectData = newData.data;
}
function updateSNPEvidenceRNASeqData(newData) {
    SNPEvidenceRNASeqObjectData = newData.data;
}


function updateHaplotypePaginationData(newData) {
    haplotypePaginationData = newData;
}
function updateSNPPaginationData(newData) {
    SNPPaginationData = newData;
}
function updateTranscriptPaginationData(newData) {
    transcriptPaginationData = newData;
}
function updateAllTranscriptPaginationData(newData) {
    allTranscriptPaginationData = newData;
}
function updateMosaicTPMPaginationData(newData) {
    mosaicTPMPaginationData = newData;
}
function updateXenologousTPMPaginationData(newData) {
    xenologousTPMPaginationData = newData;
}
function updateGeneTPMPaginationData(newData) {
    geneTPMPaginationData = newData;
}
function updateTranscriptTPMPaginationData(newData) {
    transcriptTPMPaginationData = newData;
}
function updateAllTranscriptTPMPaginationData(newData) {
    allTranscriptTPMPaginationData = newData;
}
function updateMosaicNetworkNodesPaginationData(newData) {
    mosaicNetworkNodesPaginationData = newData;
}
function updateMosaicNetworkEdgesPaginationData(newData) {
    mosaicNetworkEdgesPaginationData = newData;
}
function updateXenologousNetworkNodesPaginationData(newData) {
    xenologousNetworkNodesPaginationData = newData;
}
function updateXenologousNetworkEdgesPaginationData(newData) {
    xenologousNetworkEdgesPaginationData = newData;
}
function updateGeneNetworkNodesPaginationData(newData) {
    geneNetworkNodesPaginationData = newData;
}
function updateGeneNetworkEdgesPaginationData(newData) {
    geneNetworkEdgesPaginationData = newData;
}
function updateSNPEvidenceBothPaginationData(newData) {
    SNPEvidenceBothPaginationData = newData;
}
function updateSNPEvidenceIsoSeqPaginationData(newData) {
    SNPEvidenceIsoSeqPaginationData = newData;
}
function updateSNPEvidenceRNASeqPaginationData(newData) {
    SNPEvidenceRNASeqPaginationData = newData;
}



function updateHaplotypeEchartParamsData(newData) {
    haplotypeEchartParamsData = newData;
}
function updateSNPEchartParamsData(newData) {
    SNPEchartParamsData = newData;
}
function updateTranscriptEchartParamsData(newData) {
    transcriptEchartParamsData = newData;
}

function updateFormerTranscriptHighlightIndex(newData) {
    formerTranscriptHighlightIndex = newData;
}


function updateCurrentGenome(newData) {
    currentGenome = newData;
}
function updateCurrentIDIndex(newData) {
    currentIDIndex = newData;
}
function updateNextSearchID(newData) {
    nextSearchID = newData;
}
// 由于接收的格式是{'status': 'success', 'id': 1, 'nextID': GT42G00001 , 'type': mosaic}，因此可以使用这个函数一次性更新currentIDIndex、previousSearchID和nextSearchID
function updateNextIDData(newData) {
    updateCurrentIDIndex(newData.id);
    previousSearchID = nextSearchID; // 保存上一个搜索的ID
    nextSearchID = newData.nextID; // 更新下一个搜索的ID
}

function updateMosaicHubNetworkGraphJSON(newData) {
    mosaicHubNetworkGraphJSON = newData;
}
function updateXenologousHubNetworkGraphJSON(newData) {
    xenologousHubNetworkGraphJSON = newData;
}
function updateGeneHubNetworkGraphJSON(newData) {
    geneHubNetworkGraphJSON = newData;
}


// 如果使用直接赋值的方式, 由于JavaScript中的对象变量存储的是对象的地址, 这种直接赋值实际上是新建了一个对象，
// 并进行了地址指向的更新, 而不是更新原来的对象，因此对于本文件中的resolutionToSingleNetworkGraphJSON映射将会一直存储的是空值
function updateMosaicSingleNetworkGraphJSON(newData) {
    // mosaicSingleNetworkGraphJSON = newData.data;
    Object.assign(mosaicSingleNetworkGraphJSON, newData.data);
}
function updateXenologousSingleNetworkGraphJSON(newData) {
    // xenologousSingleNetworkGraphJSON = newData.data;
    Object.assign(xenologousSingleNetworkGraphJSON, newData.data);
}
function updateGeneSingleNetworkGraphJSON(newData) {
    // geneSingleNetworkGraphJSON = newData.data;
    Object.assign(geneSingleNetworkGraphJSON, newData.data);
}

function updateCurrentHubNetworkType(newData) {
    currentHubNetworkType = newData;
}
function updateCurrentSingleNetworkType(newData) {
    currentSingleNetworkType = newData;
}
function updateMosaicCurrentSearchKeyword(newData) {
    mosaicCurrentSearchKeyword = newData;
}
function updateXenologousCurrentSearchKeyword(newData) {
    xenologousCurrentSearchKeyword = newData;
}
function updateGeneCurrentSearchKeyword(newData) {
    geneCurrentSearchKeyword = newData;
}

function updateHomologousIDSet(newData) {
    homologousIDSet = newData;
}

function updateFirstInitialCoExpressionNetworkGraph(newData) {
    firstInitialCoExpressionNetworkGraph = newData;
}

function updateBlastResult(newData) {
    let blastResultData = newData.data;
    blastResultPairwiseAlignment = blastResultData.format0;
    blastResultDetailedTable = blastResultData.format7;
    blastResultSingleJSON = blastResultData.format15;
    currentBlastResultQueryIndex = 0;

    // 提取出format7表格中的数据存储到列表，每一个列表项是一个query对应的全部表格数据
    blastResultQueryTableStringList = extractTableFromBlastResultFormat7(blastResultDetailedTable);
    // 提取出format7表格中的Query ID列表
    blastQueryIDList = extractQueryIDListFromBlastResultFormat7(blastResultDetailedTable);
}
function updateCurrentBlastQuerySeqType(newData) {
    currentBlastQuerySeqType = newData;
}
function updateCurrentBlastResultQueryIndex(newData) {
    currentBlastResultQueryIndex = newData;
}
function updateBlastResultSeqType(newData) {
    blastResultSeqType = newData;
}




// 获取原始数据
function getHaplotypeRawData() {
    return _.cloneDeep(haplotypeRawData);
}
function getSNPRawData() {
    return _.cloneDeep(SNPRawData);
}
function getTranscriptRawData() {
    return _.cloneDeep(transcriptRawData);
}
function getMosaicTPMRawData() {
    return _.cloneDeep(mosaicTPMRawData);
}
function getXenologousTPMRawData() {
    return _.cloneDeep(xenologousTPMRawData);
}
function getGeneTPMRawData() {
    return _.cloneDeep(geneTPMRawData);
}
function getTranscriptTPMRawData() {
    return _.cloneDeep(transcriptTPMRawData);
}
function getAllTranscriptTPMRawData() {
    return _.cloneDeep(allTranscriptTPMRawData);
}

// 获取对象数据
function getHaplotypeObjectData() {
    return _.cloneDeep(haplotypeObjectData);
}
function getSNPObjectData() {
    return _.cloneDeep(SNPObjectData);
}
function getTranscriptObjectData() {
    return _.cloneDeep(transcriptObjectData);
}
function getMosaicTPMObjectData() {
    return _.cloneDeep(mosaicTPMObjectData);
}
function getXenologousTPMObjectData() {
    return _.cloneDeep(xenologousTPMObjectData);
}
function getGeneTPMObjectData() {
    return _.cloneDeep(geneTPMObjectData);
}
function getTranscriptTPMObjectData() {
    return _.cloneDeep(transcriptTPMObjectData);
}
function getAllTranscriptTPMObjectData() {
    return _.cloneDeep(allTranscriptTPMObjectData);
}
function getSNPEvidenceBothObjectData() {
    return _.cloneDeep(SNPEvidenceBothObjectData);
}
function getSNPEvidenceIsoSeqObjectData() {
    return _.cloneDeep(SNPEvidenceIsoSeqObjectData);
}
function getSNPEvidenceRNASeqObjectData() {
    return _.cloneDeep(SNPEvidenceRNASeqObjectData);
}

// 获取二维数组数据
function getHaplotypeArrayData() {
    return _.cloneDeep(haplotypeArrayData);
}
function getSNPArrayData() {
    return _.cloneDeep(SNPArrayData);
}
function getTranscriptArrayData() {
    return _.cloneDeep(transcriptArrayData);
}
function getMosaicTPMArrayData() {
    return _.cloneDeep(mosaicTPMArrayData);
}
function getXenologousTPMArrayData() {
    return _.cloneDeep(xenologousTPMArrayData);
}
function getGeneTPMArrayData() {
    return _.cloneDeep(geneTPMArrayData);
}
function getTranscriptTPMArrayData() {
    return _.cloneDeep(transcriptTPMArrayData);
}
function getAllTranscriptTPMArrayData() {
    return _.cloneDeep(allTranscriptTPMArrayData);
}

// 获取分页数据
function getHaplotypePaginationData() {
    return _.cloneDeep(haplotypePaginationData);
}
function getSNPPaginationData() {
    return _.cloneDeep(SNPPaginationData);
}
function getTranscriptPaginationData() {
    return _.cloneDeep(transcriptPaginationData);
}
function getAllTranscriptPaginationData() {
    return _.cloneDeep(allTranscriptPaginationData);
}
function getMosaicTPMPaginationData() {
    return _.cloneDeep(mosaicTPMPaginationData);
}
function getXenologousTPMPaginationData() {
    return _.cloneDeep(xenologousTPMPaginationData);
}
function getGeneTPMPaginationData() {
    return _.cloneDeep(geneTPMPaginationData);
}
function getTranscriptTPMPaginationData() {
    return _.cloneDeep(transcriptTPMPaginationData);
}
function getAllTranscriptTPMPaginationData() {
    return _.cloneDeep(allTranscriptTPMPaginationData);
}
function getMosaicNetworkNodesPaginationData() {
    return _.cloneDeep(mosaicNetworkNodesPaginationData);
}
function getMosaicNetworkEdgesPaginationData() {
    return _.cloneDeep(mosaicNetworkEdgesPaginationData);
}
function getXenologousNetworkNodesPaginationData() {
    return _.cloneDeep(xenologousNetworkNodesPaginationData);
}
function getXenologousNetworkEdgesPaginationData() {
    return _.cloneDeep(xenologousNetworkEdgesPaginationData);
}
function getGeneNetworkNodesPaginationData() {
    return _.cloneDeep(geneNetworkNodesPaginationData);
}
function getGeneNetworkEdgesPaginationData() {
    return _.cloneDeep(geneNetworkEdgesPaginationData);
}
function getSNPEvidenceBothPaginationData() {
    return _.cloneDeep(SNPEvidenceBothPaginationData);
}
function getSNPEvidenceIsoSeqPaginationData() {
    return _.cloneDeep(SNPEvidenceIsoSeqPaginationData);
}
function getSNPEvidenceRNASeqPaginationData() {
    return _.cloneDeep(SNPEvidenceRNASeqPaginationData);
}



// 获取echart参数数据
function getHaplotypeEchartParamsData() {
    return _.cloneDeep(haplotypeEchartParamsData);
}
function getSNPEchartParamsData() {
    return _.cloneDeep(SNPEchartParamsData);
}
function getTranscriptEchartParamsData() {
    return _.cloneDeep(transcriptEchartParamsData);
}

function getFormerTranscriptHighlightIndex() {
    return _.cloneDeep(formerTranscriptHighlightIndex);
}

function getCurrentGenome() {
    return _.cloneDeep(currentGenome);
}
function getCurrentIDIndex() {
    return _.cloneDeep(currentIDIndex);
}
function getNextSearchID() {
    return _.cloneDeep(nextSearchID);
}
function getPreviousSearchID() {
    return _.cloneDeep(previousSearchID);
}

// 获取hub网络图数据
function getMosaicHubNetworkGraphJSON() {
    return _.cloneDeep(mosaicHubNetworkGraphJSON);
}
function getXenologousHubNetworkGraphJSON() {
    return _.cloneDeep(xenologousHubNetworkGraphJSON);
}
function getGeneHubNetworkGraphJSON() {
    return _.cloneDeep(geneHubNetworkGraphJSON);
}

function getMosaicSingleNetworkGraphJSON() {
    return _.cloneDeep(mosaicSingleNetworkGraphJSON);
}
function getXenologousSingleNetworkGraphJSON() {
    return _.cloneDeep(xenologousSingleNetworkGraphJSON);
}
function getGeneSingleNetworkGraphJSON() {
    return _.cloneDeep(geneSingleNetworkGraphJSON);
}

function getCurrentHubNetworkType() {
    return _.cloneDeep(currentHubNetworkType);
}
function getCurrentSingleNetworkType() {
    return _.cloneDeep(currentSingleNetworkType);
}
function getMosaicCurrentSearchKeyword() {
    return _.cloneDeep(mosaicCurrentSearchKeyword);
}
function getXenologousCurrentSearchKeyword() {
    return _.cloneDeep(xenologousCurrentSearchKeyword);
}
function getGeneCurrentSearchKeyword() {
    return _.cloneDeep(geneCurrentSearchKeyword);
}

function getHomologousIDSet() {
    return _.cloneDeep(homologousIDSet);
}

function getFirstInitialCoExpressionNetworkGraph() {
    return _.cloneDeep(firstInitialCoExpressionNetworkGraph);
}

function getBlastResultPairwiseAlignment() {
    return _.cloneDeep(blastResultPairwiseAlignment);
}
function getBlastResultDetailedTable() {
    return _.cloneDeep(blastResultDetailedTable);
}
function getBlastResultSingleJSON() {
    return _.cloneDeep(blastResultSingleJSON);
}
function getBlastResultQueryTableStringList() {
    return _.cloneDeep(blastResultQueryTableStringList);
}
function getBlastQueryIDList() {
    return _.cloneDeep(blastQueryIDList);
}
function getCurrentBlastQuerySeqType() {
    return _.cloneDeep(currentBlastQuerySeqType);
}
function getCurrentBlastResultQueryIndex() {
    return _.cloneDeep(currentBlastResultQueryIndex);
}
function getBlastResultSeqType() {
    return _.cloneDeep(blastResultSeqType);
}




function getDownloadSingleNetworkNodesTable() {
    // 这里出现了一个问题，就是resolutionToSingleNetworkGraphJSON[currentSingleNetworkType]的值在这里是空的，
    // 因为之前写的update方法是直接赋值, 而JavaScript中的对象变量实际上存储的是一个地址, 直接赋值相当于重新创建了一个新对象, 
    // 然后将新对象的地址赋值给对象变量，而不是更新原来的对象，因此这里的值是空的
    // console.log('mosaicSingleNetworkGraphJSON: ', mosaicSingleNetworkGraphJSON);
    // console.log(resolutionToSingleNetworkGraphJSON['mosaic']);
    // console.log('currentSingleNetworkType: ', currentSingleNetworkType);
    // console.log('resolutionToSingleNetworkGraphJSON: ', resolutionToSingleNetworkGraphJSON);
    // console.log('resolutionToSingleNetworkGraphJSON[currentSingleNetworkType]: ', resolutionToSingleNetworkGraphJSON[currentSingleNetworkType]);
    let nodesObjectList = resolutionToSingleNetworkGraphJSON[currentSingleNetworkType].nodes;
    console.log('nodesObjectList: ', nodesObjectList);
    const keysToKeep = ['name', 'symbolSize', 'totalDegree', 'inDegree', 'outDegree', 'adjacency'];
    let filteredObjectList = filterKeysInObjects(nodesObjectList, keysToKeep);
    console.log('filteredObjectList: ', filteredObjectList);

    // // 将adjacency列表中的数据合成为一个字符串,使用';'分隔, 如果不执行则直接下载的是数组
    // filteredObjectList.forEach(element => {
    //     element.adjacency = element.adjacency.join('; ');
    // });

    // 重新定义所有的键名
    const renameKeys = ['ID', 'symbolSize', 'totalDegree', 'inDegree', 'outDegree', 'adjacency'];
    // 修改键名
    filteredObjectList = filteredObjectList.map(element => {
        return renameKeys.reduce((acc, key, index) => {
            acc[key] = element[keysToKeep[index]];
            return acc;
        }, {});
    });
    return filteredObjectList;
}

// 仍然需要优化, 因为下载的是所有点的出入边, 之前这么做是写视图函数的时候误打误撞, 刚好显示出了中心点的邻接点与邻接点之间的联系
function getDownloadSingleNetworkEdgesTable() {
    let edgesObjectList = resolutionToSingleNetworkGraphJSON[currentSingleNetworkType].edges;
    console.log('edgesObjectList: ', edgesObjectList);
    const keysToKeep = ['source', 'target', 'lineStyle'];
    let filteredObjectList = filterKeysInObjects(edgesObjectList, keysToKeep);
    console.log('filteredObjectList: ', filteredObjectList);

    // 将lineStyle对象中的width属性提取出来并替换原来的lineStyle对象
    filteredObjectList.forEach(element => {
        element.lineStyle = element.lineStyle.width;
    });

    // 重新定义所有的键名
    const renameKeys = ['source', 'target', 'weight'];
    // 修改键名
    filteredObjectList = filteredObjectList.map(element => {
        return renameKeys.reduce((acc, key, index) => {
            acc[key] = element[keysToKeep[index]];
            return acc;
        }, {});
    });

    return filteredObjectList;
}

function getDownloadHaplotypeTable() {
    const keysToKeep = ['mosaicID', 'geneID', 'areaType', 'length', 'nucleotideSequence'];
    let filteredObjectList = filterKeysInObjects(haplotypeObjectData, keysToKeep);
    return filteredObjectList;
}

function getDownloadSNPTable() {
    const keysToKeep = ['mosaicID', 'SNPSite', 'SNPType', 'IsoSeqEvidence', 'RNASeqEvidence', 'haplotypeSNP'];
    let filteredObjectList = filterKeysInObjects(SNPObjectData, keysToKeep);
    return filteredObjectList;
}

function getDownloadTranscriptTable() {
    const keysToKeep = ['mosaicID', 'geneID', 'transcriptID', 'transcriptIndex', 'areaType', 'start', 'end', 'length', 'transcriptRange', 'transcriptLength', 'nucleotideSequence', 'proteinSequence'];
    let filteredObjectList = filterKeysInObjects(transcriptObjectData, keysToKeep);
    return filteredObjectList;
}

function getDownloadMosaicTPMTable() {
    let filteredObjectList = filterKeysInObjects(mosaicTPMObjectData, TPM_data_table_download_keys_to_keep);
    return filteredObjectList;
}

function getDownloadXenologousTPMTable() {
    let filteredObjectList = filterKeysInObjects(xenologousTPMObjectData, TPM_data_table_download_keys_to_keep);
    return filteredObjectList;
}

function getDownloadGeneTPMTable() {
    let filteredObjectList = filterKeysInObjects(geneTPMObjectData, TPM_data_table_download_keys_to_keep);
    return filteredObjectList;
}

function getDownloadTranscript() {
    let filteredObjectList = filterKeysInObjects(transcriptTPMObjectData, TPM_data_table_download_keys_to_keep);
    return filteredObjectList;
}

function getDownloadAllTranscriptTPMTable() {
    let filteredObjectList = filterKeysInObjects(allTranscriptTPMObjectData, TPM_data_table_download_keys_to_keep);
    return filteredObjectList;
}

function getDownloadSNPEvidenceBothTable() {
    const keysToKeep = ['mosaicID', 'SNPSite', 'SNPType', 'IsoSeqEvidence', 'RNASeqEvidence', 'haplotypeSNP'];
    let filteredObjectList = filterKeysInObjects(SNPEvidenceBothObjectData, keysToKeep);
    return filteredObjectList;
}

function getDownloadSNPEvidenceIsoSeqTable() {
    const keysToKeep = ['mosaicID', 'SNPSite', 'SNPType', 'IsoSeqEvidence', 'haplotypeSNP'];
    let filteredObjectList = filterKeysInObjects(SNPEvidenceIsoSeqObjectData, keysToKeep);
    return filteredObjectList;
}

function getDownloadSNPEvidenceRNASeqTable() {
    const keysToKeep = ['mosaicID', 'SNPSite', 'SNPType', 'RNASeqEvidence', 'haplotypeSNP'];
    let filteredObjectList = filterKeysInObjects(SNPEvidenceRNASeqObjectData, keysToKeep);
    return filteredObjectList;
}


// 数据请求, 相当于axios.get(url).then(response => response.data).catch(error => console.error('数据请求失败:', error));
async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('数据请求失败:', error);
        throw error; // 重新抛出错误，让调用者处理
    }
}

async function fetchPostData(type, postData) {
    try {
        const url = apiPrefix.IP + apiPrefix.app + apiPrefix[type];
        console.log('postUrl: ', url);
        console.table('postData: ', postData);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(postData),
        });
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error(`${type}数据加载失败:`, error);
        return { type: type, data: [] }; // 返回一个空数据结构
    }

}


// 请求全部数据
async function fetchRawData(type, searchKeyword) {
    try {
        const dataRequestUrl = apiPrefix.IP + apiPrefix.app + apiPrefix[type] + '?' +
            apiPrefix.parameter.searchKeyword + searchKeyword;
        console.log(dataRequestUrl);
        const data = await fetchData(dataRequestUrl);
        return data;
    } catch (error) {
        console.error(`${type}数据加载失败:`, error);
        return { type: type, data: [] }; // 返回一个空数据结构
    }
}

// 请求分页数据
async function fetchPaginationData(type, searchKeyword, page = 1) {
    try {
        const dataRequestUrl = apiPrefix.IP + apiPrefix.app + apiPrefix[type] + '?' +
            apiPrefix.parameter.searchKeyword + searchKeyword + '&' +
            apiPrefix.parameter.page + page;
        console.log(dataRequestUrl);
        const data = await fetchData(dataRequestUrl);
        console.log(data);
        return data;
    } catch (error) {
        console.error(`${type}数据加载失败:`, error);
        return { numPages: 0, currentPage: 0, pageSize: 1, totalRecords: 0, searchKeyword: searchKeyword, type: type, data: [{}] }; // 返回一页空数据
    }
}

// 请求genomeIDList数据
async function fetchGenomeIDList() {
    try {
        const dataRequestUrl = apiPrefix.IP + apiPrefix.app + 'getGenomeIDList/';
        console.log(dataRequestUrl);
        const data = await fetchData(dataRequestUrl);
        return data;
    } catch (error) {
        console.error('genomeIDList数据加载失败:', error);
        return { type: 'genomeIDList', data: [] }; // 返回一个空数据结构
    }
}

// 请求下一个genomeID
async function fetchNextSearchIDData(type, currentIDIndex) {
    try {
        const dataRequestUrl = apiPrefix.IP + apiPrefix.app + apiPrefix[type] + '?' +
            apiPrefix.parameter.currentIDIndex + currentIDIndex;
        console.log(dataRequestUrl);
        const data = await fetchData(dataRequestUrl);
        return data;
    } catch (error) {
        console.error(`${type}数据加载失败:`, error);
        return {}; // 返回一个空数据结构
    }
}

// 请求hub网络数据
async function fetchHubNetworkGraphJSON(type) {
    try {
        const dataRequestUrl = apiPrefix.IP + apiPrefix.app + apiPrefix['hubNetworkGraphJSON'] + '?' +
            apiPrefix.parameter.networkType + type;
        console.log(dataRequestUrl);
        const data = await fetchData(dataRequestUrl);
        return data;
    } catch (error) {
        console.error('hub网络数据加载失败:', error);
        return {}; // 返回一个空数据结构
    }
}

// 请求single网络数据
async function fetchSingleNetworkGraphJSON(type, searchKeyword) {
    try {
        const dataRequestUrl = apiPrefix.IP + apiPrefix.app + apiPrefix['singleNetworkGraphJSON'] + '?' +
            apiPrefix.parameter.networkType + type + '&' +
            apiPrefix.parameter.searchKeyword + searchKeyword;
        console.log(dataRequestUrl);
        const data = await fetchData(dataRequestUrl);
        return data;
    } catch (error) {
        console.error('single网络数据加载失败:', error);
        return {}; // 返回一个空数据结构
    }
}

function updateData(type, data) {
    // 从映射中获取数据集对应的更新函数并调用它
    const func = updateDataFunctions[type];
    // console.log(type)
    // console.log(func);
    if (func) {
        func(data);
    } else {
        console.error(`未知的数据类型: ${type}`);
    }
}

function getData(type) {
    const func = getDataFunctions[type];
    if (func) {
        return func();
    } else {
        console.error(`未知的数据类型: ${type}`);
    }
}

// 验证genomeID是否合法
async function validateGenomeID(genomeID) {
    try {
        const dataRequestUrl = `${apiPrefix.IP}${apiPrefix.app}${apiPrefix.validateGenomeID}?${apiPrefix.parameter.genomeID}${genomeID}`;
        console.log(dataRequestUrl);
        const response = await fetch(dataRequestUrl);
        if (!response.ok) { // response.ok是一个布尔值，它在响应的状态码是200-299范围内时为true，表示请求成功了；在其他情况下是false，表示请求失败。
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const validateResult = await response.json();
        return validateResult;
    } catch (error) {
        console.error('Genome ID验证失败:', error);
        // 这里可以更新UI来向用户显示具体的错误信息
    }
}

function getCurrentPageName() {
    // 通过URL路径名来判断当前是哪个页面, 这里好像是弱匹配，即Full和full都会匹配到FullLengthTranscriptome
    const pathName = window.location.pathname;
    if (pathName.includes('index.html')) {
        return 'index';
    } else if (pathName.includes('fullLengthTranscriptome.html')) {
        return 'FullLengthTranscriptome';
    } else if (pathName.includes('geneExpressionProfile.html')) {
        return 'GeneExpressionProfile';
    } else if (pathName.includes('singleCoExpressionNetwork.html')) {
        return 'SingleCoExpressionNetwork';
    } else if (pathName.includes('haplotypeSNP.html')) {
        return 'HaplotypeSNP';
    } else {
        return 'default';
    }
}


export { fetchRawData, fetchPostData, fetchPaginationData, fetchGenomeIDList, fetchNextSearchIDData, fetchHubNetworkGraphJSON, fetchSingleNetworkGraphJSON, updateData, getData, validateGenomeID, getCurrentPageName };
