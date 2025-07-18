const allHitsTableDataNucleotide = `q1	GT42G000001	98.272	405	7	0	509	913	2000	2404	0.0	710	1/1
q1	GT42G000001	100.000	370	0	0	702	1071	3948	4317	0.0	684	1/1
q1	GT42G000001	100.000	222	0	0	415	636	197	418	1.65e-113	411	1/1
q1	GT42G000001	100.000	222	0	0	197	418	415	636	1.65e-113	411	1/1
q1	GT42G000001	99.468	188	1	0	518	705	2387	2574	6.11e-93	342	1/1
q1	GT42G000001	99.219	128	1	0	291	418	2000	2127	1.38e-59	231	1/1
q1	GT42G000001	100.000	119	0	0	300	418	2387	2505	2.99e-56	220	1/1
q1	GT42G022956	98.919	370	4	0	702	1071	1726	1357	0.0	662	1/-1
q1	GT42G000002	81.805	665	102	16	415	1071	343	996	2.02e-152	540	1/1
q1	GT42G000097	91.644	371	29	2	702	1071	1311	1680	4.40e-144	512	1/1
q1	GT42G000097	91.409	291	25	0	415	705	203	493	3.57e-110	399	1/1
q1	GT42G000097	89.262	298	32	0	121	418	127	424	2.17e-102	374	1/1
q1	GT42G004106	79.421	656	123	10	415	1067	296	942	2.70e-126	453	1/1
q1	GT42G022914	86.104	367	43	5	709	1071	2013	1651	7.73e-107	388	1/-1
q1	GT42G003238	82.143	364	63	2	709	1071	700	1062	1.72e-83	311	1/1
q2	GT42G016702	100.000	286	0	0	1	286	242	527	1.09e-149	529	1/1`

const allHitsTableDataPeptide = `q1	GT42G017641.SO.1.1	100.000	186	0	0	1	186	1	186	2.84e-127	357	1/1
q1	GT42G004718.SO.4.5	36.471	85	42	5	71	150	52	129	2.2	32.0	1/1
q1	GT42G004718.SO.4.4	36.471	85	42	5	71	150	61	138	2.3	32.0	1/1
q1	GT42G004718.SO.4.1	36.471	85	42	5	71	150	40	117	2.5	31.6	1/1
q1	GT42G004718.SO.2.2	36.471	85	42	5	71	150	74	151	2.5	31.6	1/1
q1	GT42G004718.SO.2.1	36.471	85	42	5	71	150	75	152	2.7	31.6	1/1
q1	GT42G004718.SO.4.2	36.471	85	42	5	71	150	68	145	2.8	31.6	1/1
q1	GT42G001440.SO.5.1	32.967	91	53	5	26	114	127	211	4.1	31.2	1/1
q1	GT42G001440.SO.4.1	29.670	91	56	3	26	114	127	211	5.5	30.8	1/1
q1	GT42G001440.SO.1.1	29.670	91	56	3	26	114	127	211	6.1	30.8	1/1
q1	GT42G001440.SO.4.2	29.670	91	56	3	26	114	127	211	6.7	30.4	1/1
q1	GT42G001440.SO.3.4	29.670	91	56	3	26	114	127	211	6.8	30.4	1/1
q1	GT42G001440.SO.6.1	29.670	91	56	3	26	114	127	211	6.9	30.4	1/1
q1	GT42G001440.SO.2.2	29.670	91	56	3	26	114	127	211	7.4	30.4	1/1
q1	GT42G001440.SS.1.1	29.670	91	56	3	26	114	127	211	7.4	30.4	1/1
q1	GT42G001440.SS.1.3	29.670	91	56	3	26	114	61	145	9.3	30.0	1/1
q1	GT42G001440.SS.2.1	29.670	91	56	3	26	114	127	211	9.3	30.0	1/1
q1	GT42G001440.SS.2.5	29.670	91	56	3	26	114	127	211	9.8	30.0	1/1`

let allHitsTableData = allHitsTableDataNucleotide;
// let allHitsTableData = allHitsTableDataPeptide;

// const tableData = rawTableData.split('\n').map(row => row.split('\t'));
// console.log('tableData:', tableData);

function populateTable(data) {
    const table = document.getElementById('all_hits_table');
    const tableBody = table.querySelector('tbody');
    tableBody.innerHTML = '';
    const rows = data.split('\n');
    rows.forEach(row => {
        const columns = row.split('\t');
        const tr = document.createElement('tr');
        columns.forEach(column => {
            const td = document.createElement('td');
            td.textContent = column.trim();
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

function updateTableFooter(data) {
    const tableFooterContainer = document.getElementById('all_hits_table_footer');
    console.log('tableFooterContainer:', tableFooterContainer);
    tableFooterContainer.innerHTML = '';
    let tableRowNum = data.split('\n').length;
    tableFooterContainer.innerHTML = `<span class="footer_notes"><span>Showing total of ${tableRowNum} hits</span></span>`;
}

populateTable(allHitsTableData);
updateTableFooter(allHitsTableData);