import React, { Component, useCallback, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import './App.css';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));
const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(
  props,
  ref
) {
  const { onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      isNumericString
    />
  );
});

NumberFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

function Form({ programs, callApi, changeEstimate, changeProgram, features }) {
  const [program, setProgram] = React.useState('');
  const [expanded, setExpanded] = React.useState('');
  const [feature, setFeature] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [num, setNum] = React.useState('');
  const [featureError, setFeatureError] = React.useState(false);
  const [numError, setNumError] = React.useState(false);
  const [program_id, setProgramID] = React.useState([]);
  const [user_input, setUserInput] = React.useState([]);
  const [ml_model_column_index, setMLIndex] = React.useState([]);
  const [featureID, setFeatureID] = React.useState([]);
  const [focusList, setFocusList] = React.useState([]);
  const [featuresInputData, setFeaturesInputData] = React.useState([]);

  const handleChange = (event) => {
    setProgram(event.target.value);
  };
  const handleChange2 = (event) => {
    setFeature(event.target.value);
  };
  const handleChange5 = (event) => {
    setCategory(event.target.value);
    console.log(event.target.value);
  };
  const handleChange3 = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleChange4 = (event) => {
    setNum(event.target.value);
  };

  const setHandleInputs = (featureItem, value) => {
    let obj = {
      id: featureItem.id,
      ml_model_column_index: featureItem.ml_model_column_index,
      user_input: value,
    };
    if (featuresInputData.length) {
      let x = featuresInputData.findIndex((data) => data.id === featureItem.id);
      if (x > -1) {
        featuresInputData[x] = obj;
        let z = [...featuresInputData];
        setFeaturesInputData(z);
      } else {
        let x = [...featuresInputData, obj];
        setFeaturesInputData(x);
        // featuresInputData.push({id:featureItem.id,ml_model_column_index:featureItem.ml_model_column_index,user_input:value})
      }
    } else {
      let x = [...featuresInputData, obj];
      setFeaturesInputData(x);
    }
  };

  useEffect(() => {
    console.log('features', features);
    checkCondition();
  }, [features]);

  const checkCondition = () => {
    setTimeout(() => {
      let x = features;
      let z = [];
      let y = x.filter((fil) => (fil.type === 'num') & (fil.importance > 5));
      y.forEach((data) => {
        let obj = {
          id: data.id,
          ml_model_column_index: data.ml_model_column_index,
          user_input: 0,
        };
        z.push(obj);
        setFeaturesInputData([...z]);
      });
    }, 100);
  };

  const getValue = (id) => {
    let x = featuresInputData.findIndex((data) => data.id === id);
    if (x > -1) {
      // console.log('getting value', featuresInputData[x]);
      return featuresInputData[x].user_input;
    } else {
      return '';
    }
  };

  const settleValue = () => {
    let y = [];
    featuresInputData.forEach((data) => {
      if (data.value === 0) {
        let obj = {
          id: data.id,
          ml_model_column_index: data.ml_model_column_index,
          user_input: 0,
        };
        y.push(obj);
      } else {
        let obj = {
          id: data.id,
          ml_model_column_index: data.ml_model_column_index,
          user_input: null,
        };
        y.push(obj);
      }
    });
    setFeaturesInputData(y);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFeatureError(false);
    setNumError(false);

    if (feature && num) {
    }

    if (feature === '') {
      setFeatureError(true);
    }

    if (num === '') {
      setNumError(true);
    }
  };

  const ref = useRef();
  const reff = useRef();
  const handleClick1 = () => {
    // settleValue()
    checkCondition();
    changeEstimate();
    ref.current.value = null;
    reff.current.value = 0;
    console.log('Reset clicked');
  };

  const handleClick2 = () => {
    if (condition()) {
      callApi(recheckValues(featuresInputData));
      console.log('Estimate clicked');
    } else {
      onTouch();
      changeEstimate();
    }
  };

  const getError = (id) => {
    let elm = focusList.findIndex((elem) => elem === id);

    if (elm > -1) {
      let x = featuresInputData.findIndex((data) => data.id === id);
      if (x > -1) {
        if (featuresInputData[x].user_input != null) {
          return false;
        } else {
          return true;
        }
        // console.log('getting value', featuresInputData[x]);
        // return featuresInputData[x].user_input;
      } else {
        return true;
      }
    }
    return false;
  };

  const focussed = (id) => {
    let x = [...focusList];
    x.push(id);
    setFocusList(x);
  };

  const condition = () => {
    let flag = true;
    let x = features.filter(
      (fil) => (fil.type === 'num') & (fil.importance <= 5)
    );
    // let y = features.filter(
    //   (fil) => (fil.type === 'num') & (fil.importance > 5)
    // );
    x.forEach((data) => {
      let elm = featuresInputData.findIndex((elem) => elem.id === data.id);
      if (elm > -1) {
        if (featuresInputData[elm].user_input != null) {
        } else {
          flag = false;
        }
      } else {
        flag = false;
      }
    });

    return flag;
  };

  const recheckValues = (featuresInputData) => {
    let x = [...featuresInputData];
    let y = features.filter(
      (fil) => (fil.type === 'num') & (fil.importance > 5)
    );
    y.forEach((data) => {
      let elm = featuresInputData.findIndex((elem) => elem.id === data.id);
      if (elm > -1) {
        if (
          !featuresInputData[elm].user_input &&
          featuresInputData[elm].user_input != 0
        ) {
          x[elm].user_input = 0;
        } else {
          // flag = false;
        }
      } else {
        // flag = false;
      }
    });

    return x;
  };

  const onTouch = () => {
    let z = [];
    let x = features.filter(
      (fil) => (fil.type === 'num') & (fil.importance <= 5)
    );
    x.forEach((data) => {
      z.push(data.id);
    });
    setFocusList(z);
  };

  return (
    <div>
      <div>
        <Box sx={{ minWidth: 0 }}>
          <FormControl fullWidth>
            <InputLabel id="select-program-label">Program</InputLabel>
            <Select
              labelId="select-program-label"
              id={program.id}
              value={program}
              key={program.id}
              label="Program"
              onChange={(event) =>
                handleChange(event, program.id) ||
                changeProgram(event.target.value)
              }
              native
              inputRef={ref}
            >
              {programs.map((program) => (
                <option value={program.id} key={program.id}>
                  {program.program_name}
                </option>
              ))}
            </Select>
          </FormControl>
        </Box>
        {program_id}
      </div>
      <br />
      <br />
      <Typography
        sx={{
          color: 'rgb(28, 28, 50)',
          fontWeight: 'bold',
        }}
      >
        Required
      </Typography>
      <br />
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': {
              m: 1,
              width: '41ch',
            },
          }}
          noValidate
          autoComplete="off"
        >
          <div className="rcorners">
            {features
              .filter((fil) => (fil.type === 'cat') & (fil.importance <= 5))
              .map((feature) => (
                <>
                  <TextField
                    required
                    select
                    value={getValue(feature.id)}
                    inputRef={ref}
                    id={feature.id}
                    label={feature.visible_name}
                    onChange={(event) =>
                      handleChange2(event, feature.id) ||
                      console.log(
                        'user_input:',
                        event.target.value,
                        'id:',
                        feature.id,
                        'ml_model_column_index:',
                        feature.ml_model_column_index
                      ) ||
                      setUserInput(event.target.value) ||
                      setFeatureID(feature.id) ||
                      setMLIndex(feature.ml_model_column_index) ||
                      setHandleInputs(feature, event.target.value)
                    }
                    error={featureError}
                    SelectProps={{
                      native: true,
                      defaultValue: '',
                    }}
                  >
                    <option>
                      <em></em>
                    </option>
                    {feature.categorical_values.map((category, i) => (
                      <option value={category} key={i} onChange={handleChange5}>
                        {category}
                      </option>
                    ))}
                  </TextField>
                  <Tooltip title={feature.description}>
                    <IconButton>
                      <HelpIcon />
                    </IconButton>
                  </Tooltip>
                </>
              ))}
            {features
              .filter((fil) => (fil.type === 'num') & (fil.importance <= 5))
              .map((feature) => (
                <>
                  <TextField
                    required
                    id={feature.id}
                    label={feature.visible_name}
                    type="number"
                    value={getValue(feature.id)}
                    onClick={() => focussed(feature.id)}
                    error={getError(feature.id)}
                    inputRef={ref}
                    onChange={(event) =>
                      handleChange4(event, feature.id) ||
                      console.log(
                        'user_input:',
                        event.target.valueAsNumber,
                        'id:',
                        feature.id,
                        'ml_model_column_index:',
                        feature.ml_model_column_index
                      ) ||
                      setUserInput(event.target.value) ||
                      setFeatureID(feature.id) ||
                      setMLIndex(feature.ml_model_column_index) ||
                      setHandleInputs(feature, parseFloat(event.target.value))
                    }
                    InputLabelProps={{
                      native: true,
                      inputComponent: NumberFormatCustom,
                    }}
                  />
                  <Tooltip title={feature.description}>
                    <IconButton>
                      <HelpIcon />
                    </IconButton>
                  </Tooltip>
                </>
              ))}
          </div>
        </Box>
        <br />
        <Accordion
          expanded={expanded === 'panel'}
          onChange={handleChange3('panel')}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography
              sx={{
                color: 'rgb(28, 28, 50)',
                fontWeight: 'bold',
              }}
            >
              Advanced
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <Box
                component="form"
                sx={{
                  '& .MuiTextField-root': { m: 1, width: '43.5ch' },
                }}
                noValidate
                autoComplete="off"
                className="contain"
              >
                <div className="rcorner2">
                  {features
                    .filter(
                      (fil) => (fil.type === 'cat') & (fil.importance > 5)
                    )
                    .map((feature) => (
                      <>
                        <TextField
                          required
                          select
                          value={getValue(feature.id)}
                          inputRef={ref}
                          id={feature.id}
                          label={feature.visible_name}
                          onChange={(event) =>
                            handleChange2(event, feature.id) ||
                            console.log(
                              'user_input:',
                              event.target.value,
                              'id:',
                              feature.id,
                              'ml_model_column_index:',
                              feature.ml_model_column_index
                            ) ||
                            setUserInput(event.target.value) ||
                            setFeatureID(feature.id) ||
                            setMLIndex(feature.ml_model_column_index) ||
                            setHandleInputs(feature, event.target.value)
                          }
                          error={featureError}
                          SelectProps={{
                            native: true,
                          }}
                        >
                          {feature.categorical_values.map((category, i) => (
                            <option
                              value={category}
                              key={i}
                              onChange={handleChange5}
                            >
                              {category}
                            </option>
                          ))}
                        </TextField>
                        <Tooltip title={feature.description}>
                          <IconButton>
                            <HelpIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    ))}
                  {features
                    .filter(
                      (fil) => (fil.type === 'num') & (fil.importance > 5)
                    )
                    .map((feature) => (
                      <>
                        <TextField
                          required
                          id={feature.id}
                          label={feature.visible_name}
                          value={getValue(feature.id)}
                          type="number"
                          defaultValue={0}
                          inputRef={reff}
                          onChange={(event) =>
                            handleChange4(event, feature.id) ||
                            console.log(
                              'user_input:',
                              event.target.valueAsNumber,
                              'id:',
                              feature.id,
                              'ml_model_column_index:',
                              feature.ml_model_column_index
                            ) ||
                            setUserInput(event.target.value) ||
                            setFeatureID(feature.id) ||
                            setMLIndex(feature.ml_model_column_index) ||
                            setHandleInputs(
                              feature,
                              parseFloat(event.target.value)
                            )
                          }
                          InputLabelProps={{
                            native: true,
                            inputComponent: NumberFormatCustom,
                          }}
                        />
                        <Tooltip title={feature.description}>
                          <IconButton>
                            <HelpIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    ))}
                </div>
              </Box>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <br /> <br /> <br />
        <div className="contain">
          <Stack direction="row" spacing={2}>
            <Button
              onClick={handleClick1}
              type="submit"
              sx={{
                color: '#e73743',
                borderColor: '#e73743',
                outlineColor: '#e73743',
                width: '140px',
                ':hover': {
                  borderColor: '#e73743',
                  outlineColor: '#e73743',
                },
              }}
              variant="outlined"
              startIcon={<DeleteIcon />}
            >
              Reset
            </Button>
            <Button
              onClick={() => handleClick2()}
              variant="contained"
              type="submit"
              endIcon={<SendIcon />}
              sx={{
                backgroundColor: 'rgb(28, 28, 50)',
                outlineColor: 'rgb(28, 28, 50)',
                width: '140px',
                ':hover': {
                  backgroundColor: 'rgb(28, 28, 50)',
                  outlineColor: 'rgb(28, 28, 50)',
                },
              }}
            >
              Estimate
            </Button>
          </Stack>
        </div>
      </form>
    </div>
  );
}

function Support({ estimate }) {
  return (
    <div>
      <h1 className="contain">{estimate}</h1>
    </div>
  );
}
export default class Estimation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      programs: [],
      features: [],
      programId: null,
      settleFeature: [],
      isLoaded: false,
      setProgram: null,
      input: null,
      program_id: null,
    };
  }

  componentDidMount() {
    fetch('https://api.calculator.tamkeen.website/programs')
      .then((res) => res.json())
      .then((json) => {
        let x = json;
        this.setState({
          programs: json,
          isLoaded: true,
        });
        x.forEach((element) => {
          fetch(
            'https://api.calculator.tamkeen.website/programs/' +
              element.id +
              '/features'
          )
            .then((res) => res.json())
            .then((jsonData) => {
              let v = { id: element.id, data: [...jsonData] };

              this.setState(
                {
                  features: [...this.state.features, v],
                  isLoaded: true,
                },
                () => {
                  //  this.setState({ settleFeature: this.state.features[0] });

                  let x = this.state.features.findIndex((data) => data.id == 1);
                  if (x > -1)
                    this.setState({
                      settleFeature: this.state.features[x].data,
                      programId: 1,
                    });
                }
              );
            });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  callApi(data) {
    let x = {
      program_id: this.state.programId,
      features: data,
    };
    axios
      .post('https://api.calculator.tamkeen.website/estimate', x)
      .then((response) =>
        this.setState(
          { input: 'Estimated Support: ' + response.data + ' BD' },
          console.log('Estimated Support: ' + response.data + ' BD')
        )
      );
  }

  changePrograms(id) {
    console.log('program id: ', id);
    this.setState({ programId: id });
    let x = this.state.features.findIndex((data) => data.id == id);
    this.setState({ settleFeature: this.state.features[x].data });
    this.changeEstimate();
  }

  changeEstimate() {
    this.setState({ input: null });
  }

  render() {
    const { isLoaded, programs, features, input } = this.state;

    if (!isLoaded)
      return (
        <div className="Estimation">
          <h2>No programs available</h2>
          <br />
        </div>
      );
    return (
      <div className="Estimation">
        <h2>Estimate your support</h2>
        <br />
        <Form
          programs={programs}
          changeProgram={(id) => {
            this.changePrograms(id);
          }}
          callApi={(data) => {
            this.callApi(data);
          }}
          changeEstimate={() => this.changeEstimate()}
          features={this.state.settleFeature ? this.state.settleFeature : []}
          estimate={input}
        />
        <br />
        <br />
        <Support estimate={input} />
      </div>
    );
  }
}
