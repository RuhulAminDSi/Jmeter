Here’s how to run your JMeter test plan named `assignment.jmx` from the command line.

### Steps to Run the Command

1. **Open Command Line or Terminal**:
   - **Windows**: Press `Win + R`, type `cmd`, and hit Enter.

2. **Navigate to the JMeter Bin Directory**:
   - Use the `cd` command to change the directory to your JMeter installation's **bin** folder. For example:
     - If JMeter is installed in `C:\apache-jmeter-5.x\`, you would type:
       ```bash
       cd C:\apache-jmeter-5.x\bin
       ```

3. **Run the Command**:
   - Use the following command structure, replacing the paths accordingly:
   ```bash
   jmeter -n -t path_to_your_file/assignment.jmx -l path_to_results/results.jtl -e -o path_to_output/report_folder
   ```

### Example Command
Assuming:
- Your `assignment.jmx` file is located at `C:\JMeterTests\assignment.jmx`
- You want the results saved in `C:\JMeterTests\results.jtl`
- You want the HTML report in a folder named `C:\JMeterTests\report_folder`

Your command would look like this:
HTML
```bash
jmeter -n -t C:\apache-jmeter-5.6.3\LoadTesting\assignment.jmx -l C:\apache-jmeter-5.6.3\LoadTesting\results.jtl -e -o C:\apache-jmeter-5.6.3\LoadTesting\report_folder1
```
CSV
```bash
jmeter -n -t C:\apache-jmeter-5.6.3\LoadTesting\assignment.jmx -l C:\apache-jmeter-5.6.3\LoadTesting\results.csv
```
Generate CSV to HTML
```bash
jmeter -g C:\apache-jmeter-5.6.3\LoadTesting\results.csv -o C:\apache-jmeter-5.6.3\LoadTesting\Report_folder
```

### Important Notes
- **Output Folder**: Make sure the `Report_folder` does not already exist. If it does, either delete it or choose a different name for the report folder.
- **File Paths**: Ensure the paths to your `.jmx` file and the output files are correct.
- **Permissions**: Run the command prompt or terminal with sufficient permissions if you encounter any issues.


###Parameterization
#Steps to parameterize
 - Put the test file in csv
 - Configure jmeter to read those test data from csv file (csv data set config)
 - Replace hard coded test data with variable (path, variable)

###Assertions
Response Assertion:
 - Add assertion and add criteria
 - Response code
 - Response body

###Timer
 - constant timer

###User
 - 100 user (threads)
 - 2 seconds for each user


Run for Report - jmeter.bat -n -t "DPE_Load\Thread Group.jmx" -l DPE_Load\results.jtl -e -o DPE_Load\report -f




