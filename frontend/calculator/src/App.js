import Navbar from './components/navbar';
import Estimation from './components/estimation';
import FAQs from './components/FAQs';
import Footer from './components/footer';
import './components/App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div>
        <div
          className="bg-image"
          style={{
            backgroundImage:
              "url('https://img.freepik.com/free-photo/light-table-there-are-dollars-magnifying-glass-pen-calculator-workplace-close-up-business-concept_380694-6542.jpg?w=2000')",
          }}
        ></div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <div className="js-word in-viewport">
          <h1 className="fc">Support Calculator</h1>
          <p className="intro">
            If you are a business owner and interested in knowing the estimated
            amount of support Tamkeen can help you with, you have come to the
            right place.
          </p>
        </div>
      </div>
      <br />
      <br />
      <br />
      <Estimation />
      <br />
      <FAQs />
      <br />
      <br />
      <Footer />
    </div>
  );
}

export default App;
