import React from 'react'
const Page404 = () => {
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
 import { Button } from '../../../ui/Button'
import { FormInput, InputGroup, InputGroupText } from '../../../ui/Form'
import { Col, Container, Row } from '../../../ui/Grid'
import { Search } from '../../../ui/icons'     <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <div className="clearfix">
              <h1 className="float-start display-3 me-4">404</h1>
              <h4 className="pt-3">Oops! You{"'"}re lost.</h4>
              <p className="text-body-secondary float-start">
                The page you are looking for was not found.
              </p>
            </div>
            <InputGroup className="input-prepend">
              <InputGroupText>
                <Icon icon={Search} />
              </InputGroupText>
              <FormInput type="text" placeholder="What are you looking for?" />
              <Button color="info">Search</Button>
            </InputGroup>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Page404
