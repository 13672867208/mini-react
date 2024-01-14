import {it,describe,expect} from 'vitest'
import react from '../core/react'
describe('createElement',()=>{
    it('createElement no props',()=>{
      const dom =   react.createElement('div',null,'123')
    //   console.log(dom)
      expect(dom).toEqual({
        type:'div',
        props:{
            children:[{
                type:'TEXT_CONTENT',
                props:{
                    nodeValue:'123',
                    children:[]
                }
            }]
        }
      })
    })
  
})