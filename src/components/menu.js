import React, {Component} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import Item from '../components/item.js'
import {setSelectedOrdering ,setFirstTimeVisit} from '../actions/actions_index.js'
import {bindActionCreators} from 'redux'
import {numberOfTags, orderingType, itemsPerPage, totalItems} from '../data/data.js'
import Pagination from 'react-js-pagination'
import ReactCSSTransitionGroup from "react-addons-css-transition-group";


//this is a smart component. Needs to have access to items to render from state

class Menu extends Component{

    constructor(props){
        super(props)
        this.state={activePage:1}
        this.selectedItemCount = 0
    }

    handlePageChange(pageNumber){
        this.setState({activePage: pageNumber});
    }

    orderItems(items){
        const ordering = this.props.selectedOrdering;
        switch (ordering){
            case orderingType.category:
            return items.sort((a,b) => {
                if(a.tag < b.tag){
                    return -1
                }
                if(a.tag > b.tag){
                    return 1
                }
                return 0
            })
            case orderingType.priceAsc:
            return items.sort((a,b) => {if(a.price>b.price) return 1})
            case ordering.priceDesc:
            return items.sort((a,b) => {if(a.price>b.price) return -1})
            default:
            return items
        }
    }

    renderItemList(pageNumber){
        const itemsArr = _.valuesIn(this.props.items);
        const activeTags = _.mapValues(this.props.selectedTags,tag => tag.selected);
        console.log('active tags is' , activeTags);
        const activeTagsCount = Object.values(activeTags).reduce((accumulator,current) => {
            if(current){
                return accumulator+1
            } else {
                return accumulator
            }
        },0);

        const orderedItemsArr = this.orderItems(itemsArr);

        const selectedItemsArr = orderedItemsArr.reduce((result, item) => {
            
            if(activeTagsCount === numberOfTags || activeTagsCount == 0 ){
                result.push(<Item item={item} key={item.id}/>)
                return result;
            } else if(this.props.selectedTags[item.tag].selected){
                result.push (<Item item={item} key={item.id}/>)
                return result;
            } else{
                return result;
            }
        },[]);

        this.selectedItemCount = selectedItemsArr.length;
            if(pageNumber === 1){
                return selectedItemsArr.slice(0,itemsPerPage);
            } 

            const pagedItems = selectedItemsArr.slice(itemsPerPage*pageNumber-itemsPerPage,itemsPerPage*pageNumber);
            return pagedItems;
        };

    componentDidMount(){
        this.props.setFirstTimeVisit(false);
    }


    render(){
        const menuTransitionOptions = {
            transitionName:"menu",
            transitionAppear:this.props.firstTimeVisit,
            transitionEnter:false,
            transitionLeave:false,
            transitionAppearTimeout:2000,
            transitionLeaveTimeout:2500,
            transitionEnterTimeout:2500,
        };

        const paginationOptions = {
            activePage:this.state.activePage,
            itemsCountPerPage:itemsPerPage,
            totalItemsCount:this.selectedItemCount,
            pageRangeDisplayed:Math.round(this.selectedItemCount/itemsPerPage)       
        }
    
    return (
        <div className="container items">
                    <div className="col-md-12">
                        <ReactCSSTransitionGroup {...menuTransitionOptions}>
                         {this.renderItemList(this.state.activePage)}
                        </ReactCSSTransitionGroup>
                    </div>
                    <Pagination {...paginationOptions} onChange={(pageNumber)=>this.handlePageChange(pageNumber)}>
                    </Pagination>
            </div>
            
            )
    }
}

function mapStateToProps({selectedTags,items,selectedOrdering,firstTimeVisit}){
    return {selectedTags:selectedTags.types,items,selectedOrdering,firstTimeVisit}
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({setSelectedOrdering:setSelectedOrdering,setFirstTimeVisit:setFirstTimeVisit},dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(Menu);
