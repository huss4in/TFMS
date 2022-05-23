import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import './App.css';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
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
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
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

export default function CustomizedAccordions() {
  const [expanded, setExpanded] = React.useState('');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div className="FAQs">
      <h2>Frequently asked questions</h2>
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography sx={{ color: 'rgb(28, 28, 50)', fontWeight: 'bold' }}>
            Does the calculator provide the actual amount a business can get?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Tamkeen support calculator estimates the support a business can get based
            on many factors. It will provide an estimation based on the input
            provided by the user.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel2'}
        onChange={handleChange('panel2')}
      >
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography sx={{ color: 'rgb(28, 28, 50)', fontWeight: 'bold' }}>
            Is it browser-based?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Yes, this tool is a browser-based tool, no installations are
            required.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel3'}
        onChange={handleChange('panel3')}
      >
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography sx={{ color: 'rgb(28, 28, 50)', fontWeight: 'bold' }}>
            What are advanced fields and what are they for?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Advanced fields are set to 0 by default but the user can fill them
            out to get a more accurate estimation.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel4'}
        onChange={handleChange('panel4')}
      >
        <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
          <Typography sx={{ color: 'rgb(28, 28, 50)', fontWeight: 'bold' }}>
            Is it for free or paid?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Free.</Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
