// Licensed to the Software Freedom Conservancy (SFC) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The SFC licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

import CommandEmitter from "./command";

export function emit(test) {
  return new Promise(async (res, rej) => { // eslint-disable-line no-unused-vars
    let result = `it("${test.name}", () => {const driver = Runner.getDriver();return driver.then(() => {`;

    let errors = [];
    result += (await Promise.all(test.commands.map((command, index) => (CommandEmitter.emit(command).catch(e => {
      errors.push({
        index: index + 1,
        ...command,
        message: e
      });
    }))))).join("");

    result += "return driver.getTitle().then(title => {expect(title).toBeDefined();Runner.releaseDriver(driver);});}).catch((e) => (Runner.releaseDriver(driver).then(() => {throw e;})));});";

    errors.length ? rej({...test, commands: errors}) : res(result);
  });
}

export default {
  emit
};
