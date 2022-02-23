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

export const getAllPosition = (rows) => {
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

export const getAllSkill = (rows) => {
    var dataStartRow = convertRowNumberToNumber(10)
    var skillRow = convertRowNumberToNumber(8)
    var dataStartColumn = convertColumnLetterToNumber('L')

    console.log(rows)
    //var skillJsonData = {};
    const skillData = [...rows];
    skillData.splice(0, dataStartRow)
    //const skillData = [...rows.splice(0, dataStartRow)];
    console.log(rows)
    const totalIterations = skillData[0].length;
    let segment = "";
    let isCore = false;
    let line = "";
    let competency = "";
    //let result = [];
    let theData = [];
  
    for (let index = dataStartColumn; index < totalIterations; index++) {
      if (skillData[0][index] && segment !== skillData[0][index]) {
        segment = skillData[0][index];
      }
  
      if (skillData[1][index]) {
        if (skillData[1][index] === "Core") {
          isCore = true;
        } else {
          isCore = false;
        }
      }
  
      if (skillData[2][index] && line !== skillData[1][index]) {
        line = skillData[2][index];
      }
  
      if (skillData[3][index] && competency !== skillData[3][index]) {
        competency = skillData[3][index];
      }

      const data2 = {
        skill_id: skillData[skillRow][index],
        skill_name: skillData[skillRow+1][index],
        segment: segment,
        is_core: isCore ? 1 : 0,
        line: line,
        competency: competency,
      };
      theData.push(data2);
      //skillJsonData[data.skillName] = data.skillId;
    }
   return theData
}

export const getAllUser = (rows, positions, selectedquarter, selectedyear, doError) => {
    //console.log('getAllUser')
    var dataStartRow = convertRowNumberToNumber(10)
    var theData = []
    var localError = ''
    for (let r = dataStartRow; r < rows.length; r++) {        
        const found = positions.find(element => element.position_name === rows[r][4]);
        //console.log(found)
        var positionId = ''
        if (found === undefined) {
            positionId = null
            //alert(rows[r][4] + ' is undefined')
            console.log('undefined',rows[r][4])
            localError = localError + rows[r][4] + ' is undefined' + ', '
            
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
            // "job_band": 0, //null,
            // "segment": 0, //null,
            // "sub_function":0, // null,
            // "function": 0 //null
        })
    }
    doError(localError)
    return theData
}

export function getPositionTarget(rows) {
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

export const getUserSkill = (rows, isSelfRating, selectedquarter, selectedyear) => {
    var dataStartRow = convertRowNumberToNumber(10)
    var skillRow = convertRowNumberToNumber(8)
    var dataStartColumn = convertColumnLetterToNumber('L')
    var theData = []
    var skillData = rows[skillRow]
    console.log(rows)
    for (let r = dataStartRow; r < rows.length; r++) {
        let userId = rows[r][0]; //row,col
        // console.log(userId)
        if (userId) {
            for (let c = dataStartColumn; c < rows[0].length; c++) {
                theData.push({
                    "user_id": userId,
                    "skill_id": skillData[c], //rows[r][c],
                    "rating": rows[r][c] >= 0 ? rows[r][c] : null,
                    "is_self": isSelfRating ? 1 : 0,
                    "user_year": selectedyear.value,
                    "user_quarter": selectedquarter.value
                })
            }
        }
    }
    return theData
}

