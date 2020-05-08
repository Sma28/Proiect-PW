import React, {useState, useEffect}  from 'react';
import logo from './logo.svg';
import './App.css';
import {HashRouter, Switch, Route, Link} from "react-router-dom";
import Axios from 'axios';
import qs from 'qs';
import {
  Collapse,
  NavbarToggler,
  NavbarBrand,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  NavbarText
} from 'reactstrap';
import { Provider as AlertProvider, useAlert  } from 'react-alert';
import { Formik, Form, Field } from "formik";
import {Card, Button, Badge, Nav, Navbar, NavDropdown, Modal, Alert, Toast, Carousel, Jumbotron, Container, Tooltip, OverlayTrigger} from "react-bootstrap";

import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import './bootstrap/dist/css/bootstrap.min.css';
import base64 from 'base-64';
import { render } from '@testing-library/react';

var initialState = {
  username : '',
  password : ''
}

function Authenticate() {

  
  const [state, setState] = useState(initialState);

  const handleSubmit = values => {
    
    
    
    console.log(state);
    Axios.post("http://localhost:3000/api/v1/users/register", {
      username : values.username,
      password : values.password,
      email: values.email
    }).then(res => {
      console.log(res);
      console.log('here');
    });
  }

  const handleLogin = values => {
    console.log(values);
    
    Axios.post("http://localhost:3000/api/v1/users/login", {
      username : values.username,
      password : values.password
    }).then(res => {
      console.log('data');
      console.log(res.data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.username);
      console.log('here');
    }).catch(err => {
      console.log(err);
      console.log(Object.getOwnPropertyNames(err));
      console.log(err.response.data.error);
      render (
      <Alert  variant={'warning'}>
        {err.response.data.error}
      </Alert>
      );
    }
    );
  }

  const handleInputChange = event => {
    const target = event.target;
    const value = target.name === 'username' ? state.username = target.value : state.password = target.value;
  }

  return (
    <div>
      {/* <Nav1></Nav1> */}

      <Formik
          initialValues={{
            username: "",
            password: ""
          }}
          onSubmit={handleLogin}
          
        >
        <Form >
        
          <label>
          Username:
          </label>
          <br/>
          <Field name="username"  className = "input"/>
          <br/>
          <label>
          Password:
          </label>
          <br/>
          <Field name="password" className = "input" />
          <br/>
          <br/>
          <Button variant="dark"  type="submit" name = 'Login' value="Login">Login</Button>
          {/* <Button onClick = {handleLogin} variant="dark"  >Login</Button> */}
        </Form>
      </Formik>
    </div>
  );
}

function Register(props) {
  const [state, setState] = useState(initialState);

  const handleSubmit = values => {
    
    
    
    console.log(values);
    Axios.post("http://localhost:3000/api/v1/users/register", {
      username : values.username,
      password : values.password,
      email: values.email
    }).then(res => {
      console.log(res);
      console.log('here');
    });
  }



  return (
    <div>
      {/* <Nav1></Nav1> */}

      <Formik
          initialValues={{
            username: "",
            password: "",
            email: ""
          }}
          onSubmit={handleSubmit}
          
        >
        <Form >
        <label>
          Email:
          </label>
          <br/>
          <Field name="email"  className = "input"/>
          <br/>
          <label>
          Username:
          </label>
          <br/>
          <Field name="username"  className = "input"/>
          <br/>
          <label>
          Password:
          </label>
          <br/>
          <Field name="password" className = "input" />
          <br/>
          <br/>
          <Button variant="dark"  type="submit" name = 'Register' value="Register">Register</Button>
          
        </Form>
      </Formik>
    </div>
  );
}

function Author(props) { 

  console.log('props ' + props.data.Id);

  const deleteAuthor = () => {
    console.log('aici');
    console.log(props);
    const token = localStorage.getItem('token');
    var url = 'http://localhost:3000/api/v1/authors/' + props.data._id;
    Axios.delete(url,{
      headers: {
        Authorization: `Bearer ${token}`
    }
    })
    .then(res => {
      console.log(res);
      async function fetchData() {
        const token = localStorage.getItem("token");
        const authors = await Axios.get('http://localhost:3000/api/v1/authors', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        //props.refreshApp(authors);
        console.log(authors);
    }
    fetchData().catch(err => {
        alert(err);
    });
    });
  };
  

  return (
    <>
      <td>
          {props.data.firstName}
        </td>
        <td>
          {props.data.lastName}
        </td>
        <td>
        <FontAwesomeIcon icon={faTrashAlt} onClick={deleteAuthor}/>
        </td>
    </>
  );

}

function AuthorsList () {

  
  const [authors, setAuthors] = useState([]);

    var handlerSetState = authors => {
      setAuthors(authors);
    }

    var refreshApp = () => {
      async function fetchData() {
        const token = localStorage.getItem("token");
        const authors = await Axios.get('http://localhost:3000/api/v1/authors', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        handlerSetState(authors);
        console.log(authors);
    }
    fetchData().catch(err => {
        alert(err);
    });
    }
  
    useEffect(() => {
        async function fetchData() {
            const token = localStorage.getItem("token");
            const authors = await Axios.get('http://localhost:3000/api/v1/authors', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            handlerSetState(authors.data);
            console.log(authors);
        }
        fetchData().catch(err => {
            alert(err);
        });
    }, []);

    const insertAuthor = values => {
      console.log('aici');
      console.log(values);
      const token = localStorage.getItem('token');
      Axios.post("http://localhost:3000/api/v1/authors/", {
        firstName : values.firstName,
        lastName : values.lastName
      }, {
        headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
        console.log(res);
        async function fetchData() {
          const token = localStorage.getItem("token");
          const authors = await Axios.get('http://localhost:3000/api/v1/authors', {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
          handlerSetState(authors.data);
          console.log(authors);
      }
      fetchData().catch(err => {
          alert(err);
      });
        console.log(authors);
      });
    };
  
    var initialValues={
      firstName: "",
      lastName: ""
    };
  return (
    
    <div >
      <Nav1></Nav1>
      
      <div class = 'insertAuthorForm'>
      <Formik
        initialValues={{
          firstName: "",
          lastName: ""
        }}
        onSubmit={insertAuthor}
      >
        {({ errors, touched, resetForm }) => (
          <Form>
            <label>
            First Name:
            </label>
            <br/>
            <Field name="firstName"  />
            <br/>
            <label>
            Last Name:
            </label>
            <br/>
            <Field name="lastName"  />
            <br/>
            <br/>
            <button type="submit" >Insert Author</button>
          </Form>
        )}
      </Formik>
      </div>
      <br/>
      <div class = 'authorsTable'>
        <table >
          <tr>
            <th>
              First Name
            </th>
            <th>
              Last Name
            </th>
            <th>
              Delete Action
            </th>
          </tr>
          {authors.map(author => (    
            <tr >   
              <Author data = {author} refreshApp = {refreshApp}> </Author>
            </tr> 
          ))}
        </table>
      </div>
    </div>
  );
}

var globalFood = [];

function FoodList () {

  var picture;

  const [food, setFood] = useState([]);

  var handlerSetState = food => {
    globalFood = food;
    setFood(globalFood);    
  }
 


  async function fetchData() {
    const token = localStorage.getItem("token");
    const food = await Axios.get('http://localhost:3000/api/v1/food', {
        headers: {
            Authorization: `Bearer ${token}`
        }
      });
    handlerSetState(food.data);
  };
  
    useEffect(() => {
      fetchData().catch(err => {
        alert(err);
      });

    }, []);

    const insertFood = values => {
      console.log('aici');
      console.log(values);
      console.log(picture);
      
      const token = localStorage.getItem('token');
      Axios.post("http://localhost:3000/api/v1/food/", {
        name : values.name,
        description : values.description,
        picture : picture.name,
      }, {
        headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => 
       {
         fetchData().catch(err => {
        alert(err);
      });
        // food.push({
        //   name : values.name,
        //   description : values.description,
        //   picture : picture,
        // });
        console.log(food);
        // food = res.data;
        // for (var i = 0; i < res.data.length; i ++) {
        //   food[i].picture = base64.decode(picture);
        // }
        // console.log(food);
      });
      //   async function fetchData() {
      //     const token = localStorage.getItem("token");
      //     const authors = await Axios.get('http://localhost:3000/api/v1/food', {
      //         headers: {
      //             Authorization: `Bearer ${token}`
      //         }
      //     });
      //     console.log(authors);
      // }
      // fetchData().catch(err => {
      //     alert(err);
      // });
      //   console.log(authors);
      // });
    };
    

    const onChangeHandler=event=>{

      console.log(event.target.files[0])
      picture = event.target.files[0];
      
  
  };

    var initialValues={
          name: "",
          description: "",
          picture: ""
    };

    function renderTooltipDescription(props) {
      return (
        <Tooltip id="button-tooltip" {...props}>
          You can use whatever you want(we'll not really)
        </Tooltip>
      );
    }

    function renderTooltip(props) {
      return (
        <Tooltip id="button-tooltip" {...props}>
          Use only characters
        </Tooltip>
      );
    }

    function renderTooltipPicture(props) {
      return (
        <Tooltip id="button-tooltip" {...props}>
          This shit is fucking broken I swear...
        </Tooltip>
      );
    }
  return (
    
    <div >
      <Nav1></Nav1>


      
      <div class = 'insertFoodForm'>
      <Formik
        initialValues={{
          name: "",
          description: "",
          picture: ""
        }}
        onSubmit={insertFood}
      >
        {({ errors, touched, resetForm }) => (
          <Form>
            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip}
            >
              <label>
                Name:            
              </label>
            </OverlayTrigger>
            
            <br/>
            <Field name="name"  class = "input"/>
            <br/>
            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltipDescription}
            >
              <label>
            Description:
            </label>
            </OverlayTrigger>
            
            <br/>
            <Field name="description" class = "input" />
            <br/>
            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltipPicture}
            >
              <label>
            Picture:
            </label>
            </OverlayTrigger>
            
            <br/>
            <input type="file" name="file" onChange={onChangeHandler}/>
            <br/>
            <br/>
            <Button variant="dark" type="submit" >Insert Food</Button>
          </Form>

          
        )}
      </Formik>
      </div>
      <br/>
      <div >
        
           {food.map(fd => (    
            <div class = 'items'>   
              <FoodElem data = {fd} handleRefresh={fetchData}></FoodElem>
            </div> 
          ))} 

        
      </div>
    </div>
  );
}

function FoodElem(props) { 

  const handleDelete = (data) => {
    const token = localStorage.getItem('token');
    var url = 'http://localhost:3000/api/v1/food/' + data.target.name;
    Axios.delete(url,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      console.log(res);
      props.handleRefresh();
    });
  }
    
  

  
  
  console.log('props ' + props.data);
  return (
    <>
        <Card style={{ width: '18rem' }}>
          <Card.Img variant="top" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Westworld_Logo.svg/1024px-Westworld_Logo.svg.png" />
          <Card.Body>
            <Card.Title>{props.data.name}
              <div class = "badge">
              <Badge  variant="info">New</Badge>
              </div>
            </Card.Title>
            <Card.Text>
              {props.data.description}
            </Card.Text>
          </Card.Body>
          <footer className="deleteButton">
            <Button variant="danger" name={props.data._id} onClick={handleDelete.bind(props.data._id)}>Delete</Button>
          </footer>
        </Card>

    </>
  );

}


function CreateSupport() {

  const [alert, setAlert] = useState(false);

  const handleAlert = () => setAlert(false);
  const showAlert = () => setAlert(true);

  const createSupportUser = values => {
    Axios.post("http://localhost:3000/api/v1/users/regSupport", {
      username : values.username,
      password : values.password,
      email: values.email
    }).then(res => {
      console.log(res);
      console.log('here');
      showAlert();
    });
  };

  return(
    <>
    
    {/* <Nav1></Nav1> */}

    {/* <Modal show={true}  animation={true} centered={true}>
      <Modal.Header closeButton>
        <Modal.Title>Sign in</Modal.Title>
      </Modal.Header>
      <Modal.Body> */}
      <Alert show = {alert} variant="success">
        Congrats! We've send you and email to activate your account.
      </Alert>
      <Formik
          initialValues={{
            username: "",
            password: "",
            email: ""
          }}
          onSubmit={createSupportUser}
          
        >
        <Form >
        <label>
          Email:
          </label>
          <br/>
          <Field name="email"  className = "input"/>
          <br/>
          <label>
          Username:
          </label>
          <br/>
          <Field name="username"  className = "input"/>
          <br/>
          <label>
          Password:
          </label>
          <br/>
          <Field name="password" className = "input" />
          <br/>
          <br/>
          <Button variant="dark" type="submit" >Register</Button>
        </Form>
      </Formik>
      {/* </Modal.Body>
      <Modal.Footer>
      </Modal.Footer>
    </Modal> */}
    
    </>
  );
}







function Nav1(props) {

  var popModale = false;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  

  //Register
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //SignUp
  const [showSignUp, setShowSignUp] = useState(false);
  const handleCloseSignUp = () => setShowSignUp(false);
  const handleShowSignUp = () => setShowSignUp(true);

  //SignIn
  const [showSignIn, setShowSignIn] = useState(false);
  const handleCloseSignIn = () => setShowSignIn(false);
  const handleShowSignIn = () => setShowSignIn(true);

  //Ask questions
  const [showQuestions, setShowQuestions] = useState(false);
  const handleCloseQuestions = () => setShowQuestions(false);
  const handleShowQuestions = () => setShowQuestions(true);

  const toggle = () => setDropdownOpen(prevState => !prevState);

  


 

  return (
	  
    <>

	<Navbar  className="navBar" bg="light" variant="light">
		
			<Navbar.Brand href="#/">
				<img
					alt=""
					src="data:image/png;base64,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"
					width="50"
					height="50"
					className="d-inline-block align-top"
				/>{''}
        
			</Navbar.Brand>    
    <Nav  className="mr-auto">    
			<Nav.Link href="#/" active>Home</Nav.Link>
			{/* <NavLink href="#/books" active>Books</NavLink> */}
			{/* <Nav.Link href="#/authors" active>Authors</Nav.Link> */}
      {/* <Nav.Link href="#/authenticate" active>Authenticate</Nav.Link> */}
      {/* <Nav.Link href="#/register" active>Register</Nav.Link> */}
      <Nav.Link href="#/food" active>Food</Nav.Link>
      <Nav.Link href="#/faq" active>Be curious</Nav.Link>
      
		</Nav>
    <Nav>
      <NavDropdown title="Account management" id="collasible-nav-dropdown">
        <NavDropdown.Item >Logout</NavDropdown.Item>
        {/* <NavDropdown.Item href="#/support" >Create Support</NavDropdown.Item> */}
        <NavDropdown.Item onClick={handleShow}>Create Support</NavDropdown.Item>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create a support user</Modal.Title>
          </Modal.Header>
          <Modal.Body><CreateSupport></CreateSupport></Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <NavDropdown.Item onClick={handleShowSignUp}>Sign up</NavDropdown.Item>
        <Modal show={showSignUp} onHide={handleCloseSignUp}>
          <Modal.Header closeButton>
            <Modal.Title>
              Sign up righ now!
            </Modal.Title>
          </Modal.Header>
          <Modal.Body><Register></Register></Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseSignUp}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <NavDropdown.Item onClick={handleShowSignIn}>Sign in</NavDropdown.Item>
        <Modal show={showSignIn} onHide={handleCloseSignIn}>
          <Modal.Header closeButton>
            <Modal.Title>
              Authenticate
            </Modal.Title>
          </Modal.Header>
          <Modal.Body><Authenticate></Authenticate></Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseSignIn}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <NavDropdown.Item onClick={handleShowQuestions}>Send your questions</NavDropdown.Item>
        <Modal show={showQuestions} onHide={handleCloseQuestions}>
          <Modal.Header closeButton>
            <Modal.Title>Send your questions</Modal.Title>
          </Modal.Header>
          <Modal.Body><ArticlesForm></ArticlesForm></Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseQuestions}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </NavDropdown>
    </Nav>
		{/* <Nav >
			<Dropdown nav  isOpen={dropdownOpen} toggle={toggle} >
			<DropdownToggle nav caret >
				Dropdown
			</DropdownToggle>
			<DropdownMenu>
				<DropdownItem >Logout</DropdownItem>
			</DropdownMenu>
			</Dropdown>
		</Nav> */}
    
      
        
  </Navbar>

  
      {props.children}      
    </>
    
  );
}

function ArticleHome(props) {
  if (props.data.important == true)
      return (
        <>
        <div className = 'articleCard'>
              <Card
              bg='light'
              text='black'
              
            >
              <Card.Header> Asked by {props.data.username}</Card.Header>
              <Card.Body>
                <Card.Title></Card.Title>
                <Card.Text>
                {props.data.question}
                <br/>
                <br/>
                <Card
                  bg='dark'
                  text='white'
                  
                >
                  <Card.Body>
                    <Card.Text>
                      Answer:
                      <br/>
                    {props.data.answer}
                    </Card.Text>
                  </Card.Body>
                </Card>
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        </>
  );
  else return (<></>);
}

var homeArticles = [];
function Home() {

  const [articles, setArticles] = useState([]);

  var handlerSetState = articles => {
    console.log(articles);
    homeArticles = articles;
    setArticles(homeArticles);    
  }
 


  async function fetchData() {
    const token = localStorage.getItem("token");
    const articles = await Axios.get('http://localhost:3000/api/v1/article', {
        headers: {
            Authorization: `Bearer ${token}`
        }
      });
    handlerSetState(articles.data);
  };
  
  useEffect(() => {
    fetchData().catch(err => {
      alert(err);
    });

  }, []);


  return (
    <>
    <Carousel >
      <Carousel.Item>
        <img
          className="d-block w-100 carouselImg"
          src="https://i.ytimg.com/vi/BDxx1TnWTX0/maxresdefault.jpg"
          alt="First slide"
          
        />
        <Carousel.Caption >
          <div className = "captionStyle">
            <h3>True happiness</h3>
            <p>When you hear the pizza delivery guy knocking on your door</p>
          </div>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100 carouselImg"
          src="https://static.boredpanda.com/blog/wp-content/uploads/2016/08/wet-dogs-before-after-bath-fb6__700-png.jpg"
          alt="Third slide"
        />

        <Carousel.Caption >
        <div className = "captionStyle">
          <h3>Second slide label</h3>
          <p>Wash your dog during quarantine.</p>
        </div>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100 carouselImg"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR72pKFwfvXYHqhCYpwx5_hMrJuRY5cGVEhCXJpJNl4vb0X6vyf&usqp=CAU"
          alt="Third slide"
        />

        <Carousel.Caption className = "captionStyle">
        <div className = "captionStyle">
          <h3>Skype for dogs</h3>
          <p>Keep your dog safe during quarantine.</p>
          </div>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
    <Jumbotron className='headerForm'>
    <h1>FAQ Section</h1>
    <p>
      A list of all FAQs
    </p>
  </Jumbotron>
  <div>
      {homeArticles.map(article => (    
          
          <ArticleHome data = {article} > </ArticleHome>
        
      ))}
  </div>


    </>
  );
}

function confirmAccount(props) {
  var aux = qs.parse(props.location.search, { ignoreQueryPrefix: true }).email;
  console.log(aux);

  Axios.post("http://localhost:3000/api/v1/users/confirmAccount", {
      email: aux
    }).then(res => {
      console.log(res);
      console.log('here');
    });

  return(<>
  <Nav1></Nav1>
  Your account is now active! Please log in before navigating within the browser.
  </>);
}
function ArticlesForm() {

  const handleSubmit = () => {
    console.log(document.getElementById('question').value);
    var question = document.getElementById('question').value;
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const username = localStorage.getItem('username');
    console.log('email:' + email);
      Axios.post("http://localhost:3000/api/v1/article/", {
        username: username, 
        userEmail : email,
        question : question,
        answer: '',
        important: false
      }, {
        headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => 
       {
         console.log(res);
      });
  }
    

  return (<>
  
  
<Jumbotron className='headerForm'>
  <h1>Be curious!</h1>
  <p>
    Send us your questions. Our team will try to answer ASAP.
  </p>
</Jumbotron> 
<form  className='questionForm'>
  <label htmlFor="question">Enter your question</label>
  <br/>
  <textarea id="question" name="question" type="text" className = "questionInput" rows="6"/>
  <br/>

  <Button variant="secondary" onClick={handleSubmit}>
    Send question
  </Button>
</form>

  </>);
}

var globalArticles = [];
function ArticlesList() {
  const [articles, setArticles] = useState([]);

  var handlerSetState = articles => {
    console.log(articles)
    globalArticles = articles;
    setArticles(globalArticles);    
  }
 


  async function fetchData() {
    const token = localStorage.getItem("token");
    const articles = await Axios.get('http://localhost:3000/api/v1/article', {
        headers: {
            Authorization: `Bearer ${token}`
        }
      });
    handlerSetState(articles.data);
  };
  
  useEffect(() => {
    fetchData().catch(err => {
      alert(err);
    });

  }, []);

  return (   
    
  <>      
  <Nav1></Nav1>   
    {articles.map(fd => (    
        <>   
          <Article data = {fd} handleRefresh={fetchData}></Article>
        </> 
    ))} 

    
  </>
  );
}

function Article(props) {
  // if(props.data.answer != '')

  
  const handlerAnswer = () => {
    console.log(props.data);
    console.log(document.getElementById('answer').value);
    console.log(document.getElementById('important').checked);
    console.log(props.data._id);
    var answer = document.getElementById('answer').value;
    var important = document.getElementById('important').checked;
    var question = props.data.question;
    const email = props.data.userEmail;
    const token = localStorage.getItem('token');
    var url = 'http://localhost:3000/api/v1/article/' + props.data._id;
    Axios.put(url,{
      answer : answer,
      important : important,
      email: email,
      question: question
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      console.log(res);
      props.handleRefresh();
    });
  }

  if (props.data.answer == '')
    return (
      <>
      <div className = 'articleCard'>
          <Card
          bg='info'
          text='white'
          
        >
          <Card.Header> Asked by {props.data.username}</Card.Header>
          <Card.Body>
            <Card.Title></Card.Title>
            <Card.Text>
            {props.data.question}
            </Card.Text>
            Type your answer:
            <textarea id="answer" type="text" className = "questionInputForm" rows="6"/>
            <input id="important" type = "checkbox" />
            Mark as important
            <br/>
            <Button variant="danger" onClick={handlerAnswer}>
              Send your answer
            </Button>
          </Card.Body>
        </Card>
      </div>
      </>
    );
    else return(<></>);
}


function App() {
  return (
    <HashRouter basename="/">
      <Switch>
        <Route exact path ={"/"} component={() => <>
          <Nav1>

          </Nav1>
          <Home>

          </Home>
          </>
        }/>
        <Route path={"/authenticate"} component={Authenticate}/>
        <Route path={"/register"} component={Register}/>
        {/* <Route path={"/books"} component={BooksList}/> */}
        <Route path={"/faq"} component={ArticlesList}/>
        <Route path={"/authors"} component={AuthorsList}/>
        <Route path={"/food"} component={FoodList}/>
        <Route path={"/support"} component={CreateSupport}/>
        <Route path={"/confirmAccount"} component={confirmAccount}/>
      </Switch>

    </HashRouter>
  );
}

export default App;
