import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Modal, ModalHeader, ModalBody, Button, Col, Row, Label } from 'reactstrap';
import { Loading } from './LoadingComponent';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !val || val.length <= len;
const minLength = (len) => (val) => val && val.length >= len;

class CommentForm extends Component {
  	constructor(props) {
		super(props);
		this.toggleModal = this.toggleModal.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.state = {
			isModalOpen: false,
		};
	}

  	toggleModal() {
		this.setState({
			isModalOpen: !this.state.isModalOpen,
		});
  	}
  
  	handleSubmit(values) {
		this.toggleModal();
		this.props.addComment(this.props.dishId, values.rating, values.author, values.comment);
  	}

  	render() {
		return (
			<div>
				<Button outline onClick={this.toggleModal}>
					<span className="fa fa-pencil fa-lg"></span> Submit Comment
				</Button>
				<Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
					<ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
					<ModalBody>
						<LocalForm onSubmit={(values) => this.handleSubmit(values)}>
							<Row className="form-group">
								<Label htmlFor="rating" md={2}>
									Rating
								</Label>
								<Col md={10}>
									<Control.select model=".rating" id="rating" name="rating" className="form-control">
										<option value="1">1</option>
										<option value="2">2</option>
										<option value="3">3</option>
										<option value="4">4</option>
										<option value="5">5</option>
									</Control.select>
								</Col>
							</Row>
							<Row className="form-group">
								<Label htmlFor="author" md={2}>
									Your Name
								</Label>
								<Col md={10}>
									<Control.text
										model=".author"
										id="author"
										name="author"
										placeholder="Your Name"
										className="form-control"
										validators={{
											required,
											minLength: minLength(3),
											maxLength: maxLength(15),
										}}
									/>
									<Errors
										className="text-danger"
										model=".name"
										show="touched"
										messages={{
											required: "Required",
											minLength: "Must be greater than 2 characters",
											maxLength: "Must be 15 characters or less",
										}}
									/>
								</Col>
							</Row>
							<Row className="form-group">
								<Label htmlFor="comment" md={2}>Comment</Label>
								<Col md={10}>
									<Control.textarea
										model=".comment"
										id="comment"
										name="comment"
										rows="6"
										className="form-control"
									/>
								</Col>
							</Row>
							<Row className="form-group">
								<Col md={{ size: 10, offset: 2 }}>
									<Button type="submit" color="primary">
										Submit
									</Button>
								</Col>
							</Row>
						</LocalForm>
					</ModalBody>
				</Modal>
			</div>
		);
  	}
}

function RenderComments({comments, addComment, dishId}){
    if(comments != null){
        const comment = comments.map((comment) => {
            return (
                <li key={comment.id}>
                    {comment.comment}<br />--{comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}
                </li>
            );
        });
        return(
            <div>
                <h4>Comments</h4>
                <ul className="list list-unstyled">
                    {comment}
                </ul>
                <CommentForm dishId={dishId} addComment={addComment} />
            </div>
        );
    }else{
        return <div></div>;
    }
}

function RenderDish({dish}) {
    return(
        <Card>
            <CardImg top src={dish.image} alt={dish.name} />
            <CardBody>
                <CardTitle>{dish.name}</CardTitle>
                <CardText>{dish.description}</CardText>
            </CardBody>
        </Card>
    );
}

const DishDetail = (props) => {
	if (props.isLoading) {
		return(
			<div className="container">
				<div className="row">            
					<Loading />
				</div>
			</div>
		);
	}
	else if (props.errMess) {
		return(
			<div className="container">
				<div className="row">            
					<h4>{props.errMess}</h4>
				</div>
			</div>
		);
	}
	else if (props.dish != null){
        return(
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>                
                </div>
                <div className="row">
                    <div  className="col-12 col-md-5 m-1">
                        <RenderDish dish={props.dish} />
                    </div>
                    <div  className="col-12 col-md-5 m-1">
                        <RenderComments comments={props.comments} addComment={props.addComment} dishId={props.dish.id} />
                    </div>
                </div>
            </div>
        );
    }else{
        return <div></div>;
    }  
}

export default DishDetail;