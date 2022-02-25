const convertRowNumberToNumber = (val) => {
    return val-1
}

const convertColumnLetterToNumber = (str) => {
    str = str.toUpperCase();
    let out = 0, len = str.length;
    for (var pos = 0; pos < len; pos++) {
      out += (str.charCodeAt(pos) - 64) * Math.pow(26, len - pos - 1);
    }
    return out-1;
}

export const getSegmentsFromSpreadsheet = (rows, doError) => {
    var segment = rows[0]
    var allSegment = []
    for (let c = 1; c < segment.length; c++) {
        if (segment[c] !== null) {
            allSegment.push(segment[c])
        }
    }
    return allSegment
}

export const getLinesFromSpreadsheet = (rows, doError) => {
    var line = rows[2]
    var allLine = []
    for (let c = 1; c < line.length; c++) {
        if (line[c] !== null) {
            allLine.push(line[c])
        }
    }
    //console.log('line',allLine)
    return allLine
}

export const getCompetenciesFromSpreadsheet = (rows, doError) => {
    var competency = rows[3]
    var allCompetency = []
    for (let c = 1; c < competency.length; c++) {
        if (competency[c] !== null) {
            allCompetency.push(competency[c])
        }
    }
    //console.log('competency',allCompetency)
    return allCompetency
}

export const getSkillsFromSpreadsheet = (rows, doError) => {
    var dataStartRow = convertRowNumberToNumber(8)
    var dataStartColumn = convertColumnLetterToNumber('L')

    var skillIds = rows[dataStartRow]
    var skillNames = rows[dataStartRow+1]
    var allSkill = []

    var cores = rows[3]
    var segments = rows[4]
    var lines = rows[5]
    var competencies = rows[6]
    var currentSegment = ''
    var currentLine = ''
    var currentCompetency = ''
    for (let c = dataStartColumn; c < skillIds.length; c++) {
        if (segments[c] !== null) {
            currentSegment = segments[c]
        }
        if (lines[c] !== null) {
            currentLine = lines[c]
        }
        if (competencies[c] !== null) {
            currentCompetency = competencies[c]
        }
        if (skillIds[c] !== null) {
            allSkill.push({
                skillID: skillIds[c],
                skillName: skillNames[c],
                competencyName: currentCompetency,
                lineName: currentLine,
                segmentName: currentSegment,
                core: cores[c]
            })
        }
    }
    return allSkill
}

export const getAllPosition = (rows, doError) => {
    //console.log('getAllPosition')
    var dataStartRow = convertRowNumberToNumber(2)
    var theData = []
    for (let r = dataStartRow; r < rows.length; r++) {
        theData.push({
            "position_id": rows[r][0],
            "position_name": rows[r][1]
        })
    }
    return theData
}

export const getAllSkill = (rows, skills, doError) => {
    var dataStartRow = convertRowNumberToNumber(10)
    //var skillRow = convertRowNumberToNumber(8)
    var dataStartColumn = convertColumnLetterToNumber('L')
    var localError = ''

    //var skillJsonData = {};
    const skillData = [...rows];
    skillData.splice(0, dataStartRow)
    console.log(skillData)
    const totalIterations = skillData[0].length;
    let skill = "";
    let competency = "";
    let line = "";
    let segment = "";
    let isCore = null;
    let theData = [];

    for (let index = dataStartColumn; index < totalIterations; index++) {
        const found = skills.find(element => element.skillID === rows[7][index]);

        if (found !== undefined) {
            skill = found.skillName  
            line = found.lineName 
            competency = found.competencyName
            segment = found.segmentName 
            isCore = null
            if (found.core.toLowerCase() === "no") {
                isCore = 0
            }
            if (found.core.toLowerCase() === "yes") {
                isCore = 1
            }
        }
        else {
            localError = localError +  ' skillID' + rows[7][index] + ', '   
            skill = ''
            line = ''
            competency = ''
            segment = ''
            isCore = null
        }

        const data2 = {
            skill_id: rows[7][index],
            skill_name: skill, //skillData[skillRow+1][index],
            competency: competency,
            line: line,
            segement: segment,
            is_core: isCore

        };
        theData.push(data2);
        //skillJsonData[data.skillName] = data.skillId;
    }
    return theData
}

export const getAllUser = (rows, positions, selectedquarter, selectedyear, doError) => {
    var dataStartRow = convertRowNumberToNumber(10)
    var theData = []
    var localError = ''
    for (let r = dataStartRow; r < rows.length; r++) {        
        const found = positions.find(element => element.position_name === rows[r][4]);
        var positionId = ''
        if (found === undefined) {
            positionId = null
            console.log('undefined',rows[r][4])
            localError = localError + rows[r][4] + ' is undefined, '       
        }
        else {
            positionId = found.position_id
        }
        theData.push({
            "user_index": null,
            "user_id": rows[r][0],
            "user_name": rows[r][1],
            "manager_name": rows[r][2],
            "position_id": positionId,
            "position_name": rows[r][4],
            "is_eb": rows[r][3] === 'EB' ? 1 : 0,
            "geo_location": rows[r][5],
            "average": rows[r][6],
            "user_quarter": selectedquarter.value,
            "user_year": selectedyear.value,
            "job_band": 4, //null,
            "segment": 4, //null,
            "sub_function": 4, // null,
            "function": 4 //null
        })
    }
    doError(localError)
    return theData
}

export function getPositionTarget(rows, doError) {
    var dataStartRow = convertRowNumberToNumber(2)
    const totalIterations = rows[dataStartRow].length;
    var dataStartColumn = convertColumnLetterToNumber('C')
    let theData = [];
    for (let r = dataStartRow; r < rows.length; r++) {
        var skillId = 1
        for (let c = dataStartColumn; c < totalIterations; c++) {
            var o = {
                "position_id": rows[r][0],
                "skill_id": skillId,
                "target_rating": rows[r][c]
            }
            theData.push(o)
            skillId++;
        }
    }
    return theData
}

export const getUserSkill = (rows, isSelfRating, selectedquarter, selectedyear, doError) => {
    var dataStartRow = convertRowNumberToNumber(10)
    var skillRow = convertRowNumberToNumber(8)
    var dataStartColumn = convertColumnLetterToNumber('L')
    var theData = []
    var skillData = rows[skillRow]
    for (let r = dataStartRow; r < rows.length; r++) {
        let userId = rows[r][0]; //row,col
        if (userId) {
            for (let c = dataStartColumn; c < rows[dataStartRow].length; c++) {
                if (rows[r][c] !== null && rows[r][c] !== -1) {
                    theData.push({
                        "user_id": userId,
                        "skill_id": skillData[c], //rows[r][c],
                        "rating": rows[r][c], // >= 0 ? rows[r][c] : null,
                        "is_self": isSelfRating ? 1 : 0,
                        "user_year": selectedyear.value,
                        "user_quarter": selectedquarter.value
                    })
                }
            }
        }
        else {

        }
    }
    return theData
}

