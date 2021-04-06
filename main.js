const loader = require('@grpc/proto-loader')
const grpc = require('@grpc/grpc-js')
const protos = loader.loadSync('protos/services.proto', { enums: String })
const protolca = grpc.loadPackageDefinition(protos).protolca

const URL = 'localhost:8080'

function printContent() {
  // print the IDs and names of the impact methods and product systems in the
  // database

  const data = new protolca.services.DataService(
    URL, grpc.credentials.createInsecure())

  // impact methods
  data.getDescriptors({ type: 'IMPACT_METHOD' })
    .on('data', method =>
      console.log(`impact method: id = ${method.id}, name = ${method.name}`))

  // product systems
  data.getDescriptors({ type: 'PRODUCT_SYSTEM' })
    .on('data', system =>
      console.log(`product system: id = ${system.id}, name = ${system.name}`))
}

function calculationExample() {
  // calculate a product system result

  const results = new protolca.services.ResultService(
    URL, grpc.credentials.createInsecure())

  var setup = {
    productSystem: { id: 'f2491025-6e05-467c-8721-6d19d3c7f2ed' },
    impactMethod: { id: 'b05a312d-d4eb-4d99-93dd-8a59181c0887' },
  }

  results.calculate(setup, (err, response) => {

    if (err) {
      console.log('calculation failed', err)
      return
    }

    const result = response.result
    const impacts = results.getImpacts(result)
    impacts.on('data', impact => {
      const s = impact.impactCategory.name
        + ': ' + impact.value
        + ' ' + impact.impactCategory.refUnit
      console.log(s)
    })

    // you should always dispose the result when you do
    // not need it anymore; otherwise you leak memory
    impacts.on('end', () => {
      results.dispose(result, err => {
        if (err) {
          console.log('failed to dispose result', err)
          return
        }
        console.log('disposed result')
        // results.close()
      })
    })
  })
}

function main() {
  // printContent()
  calculationExample()
}
main()
