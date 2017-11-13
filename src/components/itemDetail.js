import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom';
import {addToCart, updateStock} from '../actions/actions_index.js'
import {bindActionCreators} from 'redux'
import Navbar from './navbar.js';
import AlertContainer from 'react-alert'


class ItemDetail extends Component{
    
    alertOptions = {
    offset: 14,
    position: 'bottom right',
    theme: 'light',
    transition: 'scale'
    }

      
    showAlert = () => {
    this.msg.show('Item added to Cart', {
        time: 0,
        type: 'success',
        icon: <img />
    })
    }

    updateStock(id){
        this.props.updateStock(id);
    }

    addToCart(id){
        this.props.addToCart(id);
    }

    render(){
        return(
            <div>
                <Navbar />
                <h1>Item detail</h1>
                <div className="col-md-8">
                    <img src={this.props.item.image}/>
                </div>
                <div className="col-md-4">
                    <p>{this.props.item.title}</p>                    
                    <p>{this.props.item.description}</p>
                    <p>{this.props.item.price}</p>
                </div>
                <button className="btn btn-primary" onClick={() => {
                    this.showAlert()
                    this.addToCart(this.props.item.id);
                    this.updateStock(this.props.item.id)
                    }
                    }>Add to Cart</button>
                <Link to="/" className="btn btn-danger">Back</Link>
                <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
            </div>

        )
    }
}

function mapStateToProps(state,ownProps){
    return { item:state.items[ownProps.match.params.id], cart:state.cart}
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({addToCart:addToCart ,updateStock:updateStock}, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(ItemDetail);