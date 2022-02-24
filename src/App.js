import React, { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import readXlsxFile from 'read-excel-file';
import { checkExcelFile, getCurrentQuarter } from './commonHelper.jsx';
import UploadImg from './FileUpload.svg';
import Select from 'react-select';
import {
  getSegmentsFromSpreadsheet,
  getLinesFromSpreadsheet,
  getCompetenciesFromSpreadsheet,
  getSkillsFromSpreadsheet,
  getAllPosition,
  getAllSkill,
  getAllUser,
  getPositionTarget,
  getUserSkill
} from './AppHelper'

export const App = (props) => {
  const [error, setError] = useState('');
  const [selectedfilename, setSelectedFileName] = useState(null);
  const [selectedquarter, setSelectedQuarter] = useState(null);
  const [selectedyear, setSelectedYear] = useState(null);

  const [allposition, setAllPosition] = useState(null);
  const [allskill, setAllSkill] = useState(null);
  const [alluser, setAllUser] = useState(null);
  const [positiontarget, setPositionTarget] = useState(null);
  const [userskill, setUserSkill] = useState(null);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const quarter = getCurrentQuarter();
    setSelectedYear({ label: currentYear, value: currentYear })
    setSelectedQuarter({label: quarter, value: quarter})
  },[])

  const changeSelectedYear = (option) => {
    console.log('changeSelectedYear')
    setSelectedYear(option)
  }

  const changeSelectedQuarter = (option) => {
    console.log('changeSelectedQuarter')
    setSelectedQuarter(option)
  }

  const handleDrop = (accepted, rejected) => {
      let selectedFileName = '';

      if (rejected.length > 0) {
        setError('Uploaded file is over 10 MB and is therefore rejected.')
      } 
      else 
      if (accepted.length > 0) {
          const isExcel = checkExcelFile(accepted[0].type, accepted[0].name);
          if (isExcel) {
              //[selectedFile] = accepted;
              selectedFileName = accepted[0].name;
          } else {
            setError('Unsupported File Format.')
          }
      }
      setSelectedFileName(selectedFileName)

      var file = accepted[0]
      doFile(file)
  }

  const doError = (e) => {
    setError(e)
  }

  const doFile = async (file) => {
    try {
      setError('')
      var ratingsRows = await readXlsxFile(file, { sheet: "Ratings" })
      var targetsRows = await readXlsxFile(file, { sheet: "Targets" })

      // var segments = getSegmentsFromSpreadsheet(ratingsRows, doError);
      // var lines = getLinesFromSpreadsheet(ratingsRows, doError);
      // var competencies = getCompetenciesFromSpreadsheet(ratingsRows, doError);
      var skills = getSkillsFromSpreadsheet(ratingsRows, doError);
      console.log(skills)

      var allPosition = getAllPosition(targetsRows, doError); //1
      var allSkill = getAllSkill(ratingsRows, skills, doError); //2
      console.log(allSkill)
      var allUser = getAllUser(ratingsRows, allPosition, selectedquarter, selectedyear, doError); //3
      var positionTarget = getPositionTarget(targetsRows, doError); //4
      var userSkill = getUserSkill(ratingsRows, false, selectedquarter, selectedyear, doError); //5

      setAllPosition(window.URL.createObjectURL(new Blob([JSON.stringify(allPosition,null,2)])))
      setAllSkill(window.URL.createObjectURL(new Blob([JSON.stringify(allSkill,null,2)])))
      setAllUser(window.URL.createObjectURL(new Blob([JSON.stringify(allUser,null,2)])))
      setPositionTarget(window.URL.createObjectURL(new Blob([JSON.stringify(positionTarget,null,2)])))
      setUserSkill(window.URL.createObjectURL(new Blob([JSON.stringify(userSkill,null,2)])))

      //var selfratingsRows = await readXlsxFile(file, { sheet: "SelfRatings" })
      //console.log('selfratingsRows',selfratingsRows)
    }
    catch(e) {
      alert(e)
    }
  }

  return (
    <div style={{boxShadow:'rgba(0, 0, 0, 0.35) 0px 5px 15px',display:'flex',flexDirection:'column',border:'10px solid lightgray',width:'100%',height:'100%',boxSizing:'border-box'}}>
          
      <div style={{height:'70px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <div style={{fontSize:'24px'}}>Upload File for Benchmark Report</div><div style={{'fontSize':'10px'}}>
          v2022-02-24-b
        </div>
      </div>

      <div style={{height:'70px',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
        <div style={{width:'200px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
          <div>Year</div>
          <Select
            name="form-field-name"
            value={selectedyear}
            onChange={changeSelectedYear}
            className="search-select"
            optionalClassName="form-select-option"
            disabled={false}
            options={[
              {label: 2022, value: 2022},
              {label: 2021, value: 2021},
              {label: 2020, value: 2020}
            ]}
            clearable={false}
          />
        </div>
        <div style={{width:'200px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
          <div>Quarter</div>
          <Select
            name="form-field-name"
            value={selectedquarter}
            onChange={changeSelectedQuarter}
            className="search-select"
            optionalClassName="form-select-option"
            options={[
              {label: 1, value: 1},
              {label: 2, value: 2},
              {label: 3, value: 3},
              {label: 4, value: 4}
            ]}
            clearable={false}
          />
        </div>
      </div>

      <div style={{border:'0px solid red',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <Dropzone onDrop={handleDrop} multiple={false} maxSize={10000000}>
          {({getRootProps, getInputProps}) => (  
            <div style={{margin:'10px 10px 10px 10px',border:'1px dashed blue',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}} {...getRootProps()}>
              <input {...getInputProps()} />
              <div style={{margin:'10px 10px 10px 10px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                <div>Drop an Excel Spreadsheet file here</div>
                <div>or</div>
                <div>Choose an Excel Spreadsheet file to upload</div>
              </div>
              <img style={{height:'100px'}} src={UploadImg} alt="Data upload"/>
              <div style={{margin:'10px 10px 10px 10px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                <div>Supported Format: xlsx</div>
                <div style={{height:'20px'}}>
                  {selectedfilename !== null &&
                  <div>Selected File: {selectedfilename}</div>
                  }
                </div>
              </div>
            </div>           
          )}               
        </Dropzone>
      </div>

      {error !== '' &&
      <div style={{color:'red',margin:'10px 10px 10px 10px',border:'0px solid red',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        Error: {error}
      </div>
      }

      {userskill !== null && error === '' &&
      <>
      <div style={{margin:'10px 10px 10px 10px',border:'0px solid red',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        Downloadable Files:
      </div>
      <div style={{margin:'10px 10px 10px 10px',border:'0px solid red',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <button style={{margin:'0 10px 10px 10px'}} onClick={()=>{
          document.getElementById('allposition').click();
          document.getElementById('allskill').click();
          document.getElementById('alluser').click();
          document.getElementById('positiontarget').click();
          document.getElementById('userskill').click();     
        }}>download all</button>
        <div>{allposition !== null && <a id="allposition" download="getAllPosition.json" href={allposition}>getAllPosition.json</a>}</div>
        <div>{allskill !== null && <a id="allskill" download="getAllSkill.json" href={allskill}>getAllSkill.json</a>}</div>
        <div>{alluser !== null && <a id="alluser" download="getAllUser.json" href={alluser}>getAllUser.json</a>}</div>
        <div>{positiontarget !== null && <a id="positiontarget" download="getPositionTarget.json" href={positiontarget}>getPositionTarget.json</a>}</div>
        <div>{userskill !== null && <a id="userskill" download="getUserSkill.json" href={userskill}>getUserSkill.json</a>}</div>
      </div>
      </>
      }

    </div>
  )
}