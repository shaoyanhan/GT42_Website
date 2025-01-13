import { getData, updateData, fetchSingleNetworkGraphJSON, fetchRawData, validateGenomeID, fetchRawData2 } from "./data.js";
import { showCustomAlert } from "./showCustomAlert.js";

const typeToFunction = {
    description: updateDescription,
    go: updateGO,
    kegg: updateKEGG,
    kog: updateKOG,
    nr: updateNR,
    uniprot: updateUniprot,
    pfam: updatePfam,
};

function updateDescription(objectList) {
    console.log('updateDescription', objectList);
    let ulContainer = document.querySelector('#annotation_description');
    ulContainer.innerHTML = '';
    objectList.forEach(object => {
        let li = document.createElement('li');
        li.textContent = object.description;
        ulContainer.appendChild(li);
    });
}

function updateGO(objectList) {
    console.log('updateGO', objectList);
    let resultContainer = document.querySelector('#result_box_go');
    let table = resultContainer.querySelector('table');
    let tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    objectList.forEach(object => {
        let tr = document.createElement('tr');

        let accession = document.createElement('td');
        accession.textContent = object.accession;

        let linkTd = document.createElement('td');
        linkTd.classList.add('link_logo');
        linkTd.innerHTML = `
            <a href="https://www.ebi.ac.uk/QuickGO/term/${object.accession}"
                target="_blank" title="redirect to QuickGO database">
                <img class="logo_quick_go" src="../../img/logo_quick_go.png"
                    alt="logo_quick_go">
            </a>
            <a href="https://amigo.geneontology.org/amigo/term/${object.accession}"
                target="_blank" title="redirect to AmiGO2 database">
                <img class="logo_ami_go" src="../../img/logo_ami_go.png"
                    alt="logo_ami_go">
            </a>
        `;

        let ontology = document.createElement('td');
        ontology.textContent = object.ontology;
        let ontologyDesc;
        if (object.ontology === 'BP') {
            ontologyDesc = 'Biological Process';
        } else if (object.ontology === 'CC') {
            ontologyDesc = 'Cellular Component';
        } else if (object.ontology === 'MF') {
            ontologyDesc = 'Molecular Function';
        }
        ontology.title = ontologyDesc;

        let description = document.createElement('td');
        description.textContent = object.description;

        tr.appendChild(accession);
        tr.appendChild(linkTd);
        tr.appendChild(ontology);
        tr.appendChild(description);
        tbody.appendChild(tr);
    });

    let footer = resultContainer.querySelector('.table_footer_container');
    footer.innerHTML = `<span>Total <span class="count">${objectList.length}</span> GO terms</span>`;
}

function updateKEGG(objectList) {
    console.log('updateKEGG', objectList);
    let resultContainer = document.querySelector('#result_box_kegg');
    let table = resultContainer.querySelector('table');
    let tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    objectList.forEach(object => {
        let tr = document.createElement('tr');
        let accession = document.createElement('td');
        accession.textContent = object.accession;

        let linkTd = document.createElement('td');
        linkTd.classList.add('link_logo');
        linkTd.innerHTML = `
            <a href="https://www.genome.jp/entry/${object.accession}"
                target="_blank" title="redirect to KEGG database">
                <img class="logo_kegg" src="../../img/logo_kegg2.gif"
                    alt="logo_kegg">
            </a>
        `;

        tr.appendChild(accession);
        tr.appendChild(linkTd);
        tbody.appendChild(tr);
    });

    let footer = resultContainer.querySelector('.table_footer_container');
    footer.innerHTML = `<span>Total <span class="count">${objectList.length}</span> KEGG terms</span>`;
}

function updateKOG(objectList) {
    console.log('updateKOG', objectList);
    let resultContainer = document.querySelector('#result_box_kog');
    let table = resultContainer.querySelector('table');
    let tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    objectList.forEach(object => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${object.sseqid}</td>
            <td class="link_logo">
                <a href="https://www.ncbi.nlm.nih.gov/gene/?term=${object.sseqid}"
                    target="_blank" title="redirect to NCBI database">
                    <img class="logo_ncbi" src="../../img/logo_ncbi.png"
                        alt="logo_ncbi">
                </a>
            </td>
            <td title="Percentage of identical matches">${object.pident}</td>
            <td title="Alignment length">${object.length}</td>
            <td title="Number of mismatches">${object.mismatch}</td>
            <td title="Number of gap openings">${object.gapopen}</td>
            <td title="Start of alignment in query">${object.qstart}</td>
            <td title="End of alignment in query">${object.qend}</td>
            <td title="Start of alignment in subject">${object.sstart}</td>
            <td title="End of alignment in subject">${object.send}</td>
            <td title="Expect value">${object.evalue}</td>
            <td title="Bit score">${object.bitscore}</td>
        `;
        tbody.appendChild(tr);
    });

    let footer = resultContainer.querySelector('.table_footer_container');
    footer.innerHTML = `<span>Total <span class="count">${objectList.length}</span> KOG terms</span>`;
}

function updateNR(objectList) {
    console.log('updateNR', objectList);
    let resultContainer = document.querySelector('#result_box_nr');
    let table = resultContainer.querySelector('table');
    let tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    objectList.forEach(object => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${object.sseqid}</td>
            <td class="link_logo">
                <a href="https://www.ncbi.nlm.nih.gov/gene/?term=${object.sseqid}"
                    target="_blank" title="redirect to NCBI database">
                    <img class="logo_ncbi" src="../../img/logo_ncbi.png"
                        alt="logo_ncbi">
                </a>
            </td>
            <td title="Percentage of identical matches">${object.pident}</td>
            <td title="Alignment length">${object.length}</td>
            <td title="Number of mismatches">${object.mismatch}</td>
            <td title="Number of gap openings">${object.gapopen}</td>
            <td title="Start of alignment in query">${object.qstart}</td>
            <td title="End of alignment in query">${object.qend}</td>
            <td title="Start of alignment in subject">${object.sstart}</td>
            <td title="End of alignment in subject">${object.send}</td>
            <td title="Expect value">${object.evalue}</td>
            <td title="Bit score">${object.bitscore}</td>
        `;
        tbody.appendChild(tr);
    });

    let footer = resultContainer.querySelector('.table_footer_container');
    footer.innerHTML = `<span>Total <span class="count">${objectList.length}</span> NR terms</span>`;
}

function updateUniprot(objectList) {
    console.log('updateUniprot', objectList);
    let resultContainer = document.querySelector('#result_box_uniprot');
    let table = resultContainer.querySelector('table');
    let tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    objectList.forEach(object => {
        let tr = document.createElement('tr');

        let sseqidParts = object.sseqid.split('|');
        let gappedID = sseqidParts.join(' | ');
        let midSseqid = sseqidParts[1];
        tr.innerHTML = `
            <td>${gappedID}</td>
            <td class="link_logo">
                <a href="https://www.uniprot.org/uniprotkb/${midSseqid}/entry"
                    target="_blank" title="redirect to UniProt database">
                    <img class="logo_uniprot" src="../../img/logo_uniprot.png"
                        alt="logo_uniprot">
                </a>
            </td>
            <td title="Percentage of identical matches">${object.pident}</td>
            <td title="Alignment length">${object.length}</td>
            <td title="Number of mismatches">${object.mismatch}</td>
            <td title="Number of gap openings">${object.gapopen}</td>
            <td title="Start of alignment in query">${object.qstart}</td>
            <td title="End of alignment in query">${object.qend}</td>
            <td title="Start of alignment in subject">${object.sstart}</td>
            <td title="End of alignment in subject">${object.send}</td>
            <td title="Expect value">${object.evalue}</td>
            <td title="Bit score">${object.bitscore}</td>
        `;
        tbody.appendChild(tr);
    });

    let footer = resultContainer.querySelector('.table_footer_container');
    footer.innerHTML = `<span>Total <span class="count">${objectList.length}</span> Uniprot terms</span>`;
}

function updatePfam(objectList) {
    console.log('updatePfam', objectList);
    let resultContainer = document.querySelector('#result_box_pfam');
    let table = resultContainer.querySelector('table');
    let tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    objectList.forEach(object => {
        let tr = document.createElement('tr');

        let qaccessionPrefix = object.qaccession.split('.')[0];
        tr.innerHTML = `
            <td title="Name of the query sequence or profile">${object.qname}</td>
            <td title="Accession of the target sequence or profile">${object.qaccession}</td>
            <td class="link_logo">
                <a href="https://www.ebi.ac.uk/interpro/entry/pfam/${qaccessionPrefix}/"
                    target="_blank" title="redirect to UniProt database">
                    <img class="logo_interpro" src="../../img/logo_interpro2.png"
                        alt="logo_interpro">
                </a>
            </td>
            <td title="Length of the query sequence or profile, in residues">${object.qlen}</td>
            <td title="E-value of the overall sequence/profile comparison (including all domains)">${object.evalue}</td>
            <td title="Bit score of the overall sequence/profile comparison (including all domains)">${object.ascore}</td>
            <td title="The biased composition score correction that was applied to the bit score">${object.abias}</td>
            <td title="This domain’s number">${object.dnum}</td>
            <td title="The total number of domains reported in the sequence">${object.dsum}</td>
            <td title="Conditional E-value">${object.cevalue}</td>
            <td title="Independent E-value">${object.ievalue}</td>
            <td title="The bit score for this domain">${object.dscore}</td>
            <td title="The biased composition (null2) score correction that was applied to the domain bit score">${object.dbias}</td>
            <td title="The start of the MEA alignment of this domain with respect to the profile">${object.hfrom}</td>
            <td title="The end of the MEA alignment of this domain with respect to the profile">${object.hto}</td>
            <td title="The start of the MEA alignment of this domain with respect to the sequence">${object.afrom}</td>
            <td title="The end of the MEA alignment of this domain with respect to the sequence">${object.ato}</td>
            <td title="The start of the domain envelope on the sequence">${object.efrom}</td>
            <td title="The end of the domain envelope on the sequence">${object.eto}</td>
            <td title="The mean posterior probability of aligned residues in the MEA alignment">${object.accuracy}</td>
            <td title="Description of target">${object.description}</td>
        `;
        tbody.appendChild(tr);
    });

    let footer = resultContainer.querySelector('.table_footer_container');
    footer.innerHTML = `<span>Total <span class="count">${objectList.length}</span> Pfam terms</span>`;
}


function updateContentArea(annotationData) {
    for (let key in annotationData) {
        if (key in typeToFunction) {
            typeToFunction[key](annotationData[key]);
        }
    }
}


async function transformSearchKeyword(searchKeyword, keywordType) {
    // 如果用户输入的不是isoformID，那么使用第一个isoformID
    if (keywordType !== 'transcript') {
        // 获取第一个isoformID
        const mosaicID = searchKeyword.split('.')[0];
        const homologousIDSet = await fetchRawData('homologousIDSet', mosaicID);
        console.log('homologousIDSet', homologousIDSet);
        searchKeyword = homologousIDSet["transcript"][0];

        // 发出警告
        const message = keywordType + ' ID is not available in this page! Using the first isoform ID ' + searchKeyword + ' automatically!';
        showCustomAlert(message, 'warning', 5000);
    }

    return searchKeyword;
}

async function initialContentArea(searchKeyword, keywordType) {
    console.log("initialContentArea is called, searchKeyword: ", searchKeyword, "keywordType: ", keywordType);

    // 对ID进行转化
    searchKeyword = await transformSearchKeyword(searchKeyword, keywordType);

    // 根据ID查询所有注释
    const response = await fetchRawData2('getAnnotationIsoform', { isoformID: searchKeyword, annotationType: 'all' });
    console.log('getAnnotationIsoform', response);
    const annotationData = response.data;

    if (annotationData.length === 0) {
        showCustomAlert('Get annotation data of ' + searchKeyword + ' failed!', 'error', 3000);
        return;
    }

    updateData('annotationIsoform', annotationData);

    // 更新页面标题
    const title = document.querySelector('#annotation_id');
    title.innerText = searchKeyword;

    // 更新各个内容区域
    updateContentArea(annotationData);
}

export { initialContentArea };