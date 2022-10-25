import { get, result } from 'lodash'
import type { NextPage } from 'next'
import Image from 'next/future/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Row, Col, Table } from 'react-bootstrap'
import verifed from '../../../../assets/img/arrow.svg'
import { GetEventQuery, useDecodeEventMutation, useGetEventQuery } from '../../../../generated'
import { formatTimeAgo } from '../../../../lib/utils'
import withApollo from '../../../../lib/withApollo'
import { useToast } from '../../../hooks'

const Event: NextPage = () => {
  const router = useRouter()
  const address = router.query?.address as string
  const eventId = router.query?.eventId as string
  const { showErrorToast } = useToast()
  const { data } = useGetEventQuery({ variables: { id: eventId } })
  const event = get(data, 'getEvent', []) as GetEventQuery['getEvent']
  const [eventData, setEventData] = useState<any>({
    decodedData: '',
    formattedData: '',
  })

  const [decodeEventMutation] = useDecodeEventMutation({
    variables: { contractAddress: '', id: '' },
  })

  const decode = async () => {
    try {
      const result = await decodeEventMutation({ variables: { contractAddress: address, id: eventId } })
      const response = JSON.parse(result?.data?.decodeEvent as any)

      setEventData({
        decodedData: JSON.stringify(response?.[0].decodedDat || {}),
        formattedData: JSON.stringify(response?.[0].formattedData || {}),
      })
    } catch (error: any) {
      showErrorToast(error.message || 'error')
      // console.log('ERROR: ', error.message)
    }
  }
  useEffect(() => {
    setEventData(() => ({
      decodedData: event.decodedData,
      formattedData: event.formattedData,
    }))
  }, [event?.decodedData])

  return (
    <>
      <>
        <Row>
          <Col className="mb-4" xs="10">
            <h4>
              <b>Event Log</b>
            </h4>
          </Col>
          <Col className="mb-4" xs="2">
            <button
              className="transaction-tabs_buttons transaction-tabs_buttons-btn transaction-tabs_buttons-btn_active text-rigth"
              onClick={() => decode()}
            >
              Decode Event
            </button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table className="ink_table">
              <tbody>
                <span className="ink_table-number">{event.index}</span>
                <tr>
                  <td className="black">Transaction Hash</td>
                  <td>{event.transactionHash}</td>
                </tr>
                <tr>
                  <td className="black">Time:</td>
                  <td>{formatTimeAgo(event.timestamp)}</td>
                </tr>
                <tr>
                  <td className="black">Method:</td>
                  <td>{event.method}</td>
                </tr>
                <tr>
                  <td className="black">Section:</td>
                  <td>{event.section}</td>
                </tr>
                <tr>
                  <td className="black">Topics:</td>
                  <td>
                    <div className="transactions-logs">
                      {event.topics
                        ?.slice(1, -1)
                        .split(',')
                        .map((topic: any, index: number) => (
                          <div className="transactions-logs-row">
                            <div className="transactions-logs-number">{index}</div>
                            <div className="transactions-logs-arrow">
                              <Image src={verifed} alt="Icon" />
                            </div>
                            <div className="transactions-logs-hash">{topic}</div>
                          </div>
                        ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="black">Data:</td>
                  <td>{event.data}</td>
                </tr>
                <tr>
                  <td className="black">Formatted Data:</td>
                  <td>
                    <textarea
                      readOnly
                      className="form-control"
                      rows={5}
                      placeholder="Verify that the contract has the metadata uploaded and decode the event"
                      value={eventData?.formattedData || ''}
                    ></textarea>
                  </td>
                </tr>
                <tr>
                  <td className="black">Decoded Data:</td>
                  <td>
                    <textarea
                      readOnly
                      className="form-control"
                      rows={5}
                      placeholder="Verify that the contract has the metadata uploaded and decode the event"
                      value={eventData?.decodedData || ''}
                    ></textarea>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </>
    </>
  )
}

export default withApollo(Event)
